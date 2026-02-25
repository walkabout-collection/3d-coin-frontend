"use client";
import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

interface CoinTextTextureProps {
  text: string;
  side: "front" | "back";
  position: "top" | "bottom";
  color?: string;
  fontSize?: number;
  placeholderMesh?: THREE.Mesh | null;
  materialId?: string;
}

/**
 * Generates a normal map from a text canvas for 3D extrusion effect
 * Enhanced for realistic embossed text with proper surface normals
 */
const generateNormalMap = (
  textCanvas: HTMLCanvasElement,
  depth: number = 0.5,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = textCanvas.width;
  canvas.height = textCanvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const sourceCtx = textCanvas.getContext("2d");
  if (!sourceCtx) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const imageData = sourceCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const normalData = new Uint8ClampedArray(width * height * 4);

  // Convert text to height map (for extrusion: text = high, background = low)
  // Apply smoothing for realistic embossed edges
  const heightMap: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    heightMap.push(alpha); // Text is high (extruded)
  }

  // Generate enhanced normal map from height map with better edge detection
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const currentHeight = heightMap[idx] * depth;

      // Use Sobel-like operator for better edge detection and smoother normals
      // Sample neighboring heights with weighted contributions
      const leftHeight =
        x > 0 ? heightMap[y * width + (x - 1)] * depth : currentHeight;
      const rightHeight =
        x < width - 1 ? heightMap[y * width + (x + 1)] * depth : currentHeight;
      const topHeight =
        y > 0 ? heightMap[(y - 1) * width + x] * depth : currentHeight;
      const bottomHeight =
        y < height - 1 ? heightMap[(y + 1) * width + x] * depth : currentHeight;

      // Enhanced normal calculation with diagonal samples for smoother transitions
      const topLeftHeight =
        x > 0 && y > 0
          ? heightMap[(y - 1) * width + (x - 1)] * depth
          : currentHeight;
      const topRightHeight =
        x < width - 1 && y > 0
          ? heightMap[(y - 1) * width + (x + 1)] * depth
          : currentHeight;
      const bottomLeftHeight =
        x > 0 && y < height - 1
          ? heightMap[(y + 1) * width + (x - 1)] * depth
          : currentHeight;
      const bottomRightHeight =
        x < width - 1 && y < height - 1
          ? heightMap[(y + 1) * width + (x + 1)] * depth
          : currentHeight;

      // Calculate gradient using Sobel operator for better edge detection
      const dx =
        (topRightHeight +
          2 * rightHeight +
          bottomRightHeight -
          (topLeftHeight + 2 * leftHeight + bottomLeftHeight)) /
        4.0;
      const dy =
        (bottomLeftHeight +
          2 * bottomHeight +
          bottomRightHeight -
          (topLeftHeight + 2 * topHeight + topRightHeight)) /
        4.0;
      const dz = 1.0;

      // Normalize
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = dx / length;
      const ny = dy / length;
      const nz = dz / length;

      // Convert to RGB (normal maps use RGB for XYZ)
      const r = Math.floor((nx + 1) * 0.5 * 255);
      const g = Math.floor((ny + 1) * 0.5 * 255);
      const b = Math.floor((nz + 1) * 0.5 * 255);

      normalData[idx * 4] = r;
      normalData[idx * 4 + 1] = g;
      normalData[idx * 4 + 2] = b;
      normalData[idx * 4 + 3] = data[idx * 4 + 3]; // Preserve alpha
    }
  }

  const normalImageData = new ImageData(normalData, width, height);
  ctx.putImageData(normalImageData, 0, 0);
  return canvas;
};

/**
 * Generates a height/displacement map from text for 3D extrusion effect
 * Creates smooth gradient edges typical of minting process with softened edges
 */
const generateHeightMap = (
  textCanvas: HTMLCanvasElement,
  depth: number = 1.0,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = textCanvas.width;
  canvas.height = textCanvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const sourceCtx = textCanvas.getContext("2d");
  if (!sourceCtx) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const imageData = sourceCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const heightData = new Uint8ClampedArray(width * height * 4);

  // Create a smoother height map with minting-style softened edges
  // Use Gaussian-like blur for realistic embossed appearance
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3] / 255;

      // Apply multi-sample smoothing for realistic minting process edges
      // Larger kernel for smoother, more natural falloff
      let weightedSum = 0;
      let weightSum = 0;

      // Use a 5x5 kernel with Gaussian-like weights for smooth edges
      const kernelSize = 3;
      for (let dy = -kernelSize; dy <= kernelSize; dy++) {
        for (let dx = -kernelSize; dx <= kernelSize; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = (ny * width + nx) * 4;
            const nAlpha = data[nIdx + 3] / 255;

            // Gaussian-like weight (distance-based falloff)
            const distance = Math.sqrt(dx * dx + dy * dy);
            const weight = Math.exp(-(distance * distance) / (2 * 1.5 * 1.5));

            weightedSum += nAlpha * weight;
            weightSum += weight;
          }
        }
      }

      // Normalize and create smooth height gradient
      const smoothedAlpha = weightSum > 0 ? weightedSum / weightSum : alpha;

      // Apply additional edge softening for minting process
      // Create gentle transition from text to coin surface
      const heightValue = Math.floor(smoothedAlpha * 255 * depth);
      heightData[idx] = heightValue; // R
      heightData[idx + 1] = heightValue; // G
      heightData[idx + 2] = heightValue; // B
      heightData[idx + 3] = 255; // A
    }
  }

  const heightImageData = new ImageData(heightData, width, height);
  ctx.putImageData(heightImageData, 0, 0);
  return canvas;
};

/**
 * Creates a canvas texture from text and applies it to the placeholder mesh
 * Text is printed flat on the coin surface, not floating or placed on top
 */
export const CoinTextTexture: React.FC<CoinTextTextureProps> = ({
  text,
  side,
  position,
  color = "#000000",
  fontSize = 72,
  placeholderMesh,
  materialId = "gold",
}) => {
  // Get material-specific text colors that are darker/richer for realistic minted appearance
  // These colors provide high contrast while maintaining premium, natural appearance
  const getMaterialTextColor = (): {
    base: string;
    shadow: string;
    highlight: string;
  } => {
    switch (materialId) {
      case "gold":
        // Darker, richer gold tone for depth and readability
        return {
          base: "#B8941F", // Darker gold
          shadow: "#8B6914", // Deep shadow in recesses
          highlight: "#E6C85A", // Bright highlight on edges
        };
      case "silver":
        // Darker silver/soft gray with controlled highlights
        return {
          base: "#9A9A9A", // Darker silver-gray
          shadow: "#6B6B6B", // Deep shadow
          highlight: "#D4D4D4", // Soft highlight
        };
      case "copper":
        // Deeper copper-brown with subtle contrast
        return {
          base: "#8B5A2B", // Darker copper
          shadow: "#5C3A1C", // Deep brown shadow
          highlight: "#C98A4D", // Warm copper highlight
        };
      case "black-nickel":
        // Lighter metallic gray/polished nickel for contrast
        return {
          base: "#6B6B6B", // Medium gray
          shadow: "#4A4A4A", // Darker shadow
          highlight: "#9A9A9A", // Polished nickel highlight
        };
      case "antique-gold":
        // Muted gold with darker patina and brighter edge highlights
        return {
          base: "#A0821E", // Muted gold
          shadow: "#6B5414", // Dark patina in recesses
          highlight: "#D4B84A", // Brighter edge highlight
        };
      case "antique-silver":
        // Darker oxidized silver with soft edge highlights
        return {
          base: "#7A7A7A", // Oxidized silver
          shadow: "#4A4A4A", // Dark oxidation in valleys
          highlight: "#B4B4B4", // Soft edge highlight
        };
      case "bronze":
        // Slightly darker bronze with warm highlights
        return {
          base: "#A66B2A", // Darker bronze
          shadow: "#6B4518", // Deep shadow
          highlight: "#D49A5A", // Warm bronze highlight
        };
      case "antique-bronze":
        // Aged bronze with subtle patina contrast
        return {
          base: "#8B5A2A", // Aged bronze
          shadow: "#5C3A1A", // Patina shadow
          highlight: "#B87A4A", // Subtle patina highlight
        };
      default:
        // Default to gold
        return {
          base: "#B8941F",
          shadow: "#8B6914",
          highlight: "#E6C85A",
        };
    }
  };

  // Generate textures for 3D extrusion effect
  const textures = useMemo(() => {
    if (!text || !text.trim()) {
      return null;
    }

    // Create canvas with high resolution for crisp text
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    // Set canvas size - use higher resolution for crisp, anti-aliased text
    const canvasSize = 1024; // Higher resolution for better text quality
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Enable high-quality text rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Get material-specific text colors with shading
    const textColors = getMaterialTextColor();

    // For back side, ensure text reads left-to-right when viewing the back
    // Flip the canvas horizontally for back side to correct reading orientation
    if (side === "back") {
      ctx.save();
      // Translate to center, flip horizontally, then translate back
      ctx.translate(canvasSize / 2, canvasSize / 2);
      ctx.scale(-1, 1); // Flip horizontally
      ctx.translate(-canvasSize / 2, -canvasSize / 2);
    }

    // Enhanced text rendering for realistic minted appearance
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Use a serif font for more authentic coin appearance, fallback to sans-serif
    const fontFamily = "'Times New Roman', 'Georgia', 'Arial', sans-serif";
    ctx.font = `500 ${fontSize}px ${fontFamily}`; // Medium weight for solid appearance

    // Draw text in center of canvas with letter spacing
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;

    // Letter spacing (space between characters)
    const letterSpacing = fontSize * 0.1; // 5% of font size for spacing between characters

    // Helper function to draw text with letter spacing
    const drawTextWithSpacing = (
      textToDraw: string,
      x: number,
      y: number,
      fillStyle: string | CanvasGradient | CanvasPattern,
      strokeStyle: string | CanvasGradient | CanvasPattern,
      lineWidth: number,
      drawStroke: boolean = true,
      drawFill: boolean = true,
    ) => {
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;

      // Calculate total width of text with spacing
      let totalWidth = 0;
      for (let i = 0; i < textToDraw.length; i++) {
        const char = textToDraw[i];
        const metrics = ctx.measureText(char);
        totalWidth += metrics.width;
        if (i < textToDraw.length - 1) {
          totalWidth += letterSpacing;
        }
      }

      // Start position (centered)
      let currentX = x - totalWidth / 2;

      // Draw each character with spacing
      for (let i = 0; i < textToDraw.length; i++) {
        const char = textToDraw[i];
        if (drawStroke) {
          ctx.strokeText(char, currentX, y);
        }
        if (drawFill) {
          ctx.fillText(char, currentX, y);
        }
        const metrics = ctx.measureText(char);
        currentX += metrics.width + letterSpacing;
      }
    };

    // Draw text with realistic minted appearance using layered shading
    ctx.lineJoin = "round"; // Rounded joins for smooth edges
    ctx.lineCap = "round"; // Rounded caps for smooth edges
    ctx.miterLimit = 2; // Prevent sharp miter joins

    // Layer 1: Shadow/base layer (slightly offset for depth)
    drawTextWithSpacing(
      text,
      centerX + 1,
      centerY + 1,
      textColors.shadow,
      textColors.shadow,
      Math.max(6, fontSize * 0.15), // Thicker for shadow
    );

    // Layer 2: Main text color (base tone)
    drawTextWithSpacing(
      text,
      centerX,
      centerY,
      textColors.base,
      textColors.base,
      Math.max(4, fontSize * 0.12), // Main stroke
    );

    // Layer 3: Highlight layer (subtle, on top edges)
    ctx.globalCompositeOperation = "overlay"; // Blend mode for natural highlights
    drawTextWithSpacing(
      text,
      centerX - 0.5,
      centerY - 0.5,
      textColors.highlight,
      textColors.highlight,
      Math.max(2, fontSize * 0.06), // Thinner for highlights
    );
    ctx.globalCompositeOperation = "source-over"; // Reset blend mode

    // Restore context if we flipped for back side
    if (side === "back") {
      ctx.restore();
    }

    // Apply realistic minted text appearance with tone variation
    // This creates natural highlights, shadows, and smooth edge transitions
    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
    const data = imageData.data;
    const width = canvasSize;
    const height = canvasSize;

    // Create a processed image data for tone variation
    const processedData = new Uint8ClampedArray(data);

    // Parse color values for tone adjustment
    const parseColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const baseColor = parseColor(textColors.base);
    const shadowColor = parseColor(textColors.shadow);
    const highlightColor = parseColor(textColors.highlight);

    // Apply tone variation based on position and alpha for realistic minted appearance
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];

        if (alpha > 0) {
          // Calculate position-based tone variation (simulates lighting on minted text)
          const centerDistX = Math.abs(x - width / 2) / (width / 2);
          const centerDistY = Math.abs(y - height / 2) / (height / 2);
          const distFromCenter = Math.sqrt(
            centerDistX * centerDistX + centerDistY * centerDistY,
          );

          // Edge detection for highlights (top/left edges get more highlight)
          const isEdge = alpha < 200; // Edge pixels have lower alpha
          const isTopEdge =
            y < height * 0.3 || (y < height * 0.5 && x < width * 0.3);

          // Blend colors based on position and edge detection
          let r, g, b;

          if (isEdge && isTopEdge) {
            // Highlight on top edges
            const blend = (alpha / 255) * 0.4; // Subtle highlight blend
            r = Math.round(
              baseColor.r * (1 - blend) + highlightColor.r * blend,
            );
            g = Math.round(
              baseColor.g * (1 - blend) + highlightColor.g * blend,
            );
            b = Math.round(
              baseColor.b * (1 - blend) + highlightColor.b * blend,
            );
          } else if (alpha < 150) {
            // Shadow in recesses/deeper areas
            const blend = (1 - alpha / 150) * 0.3; // Subtle shadow blend
            r = Math.round(baseColor.r * (1 - blend) + shadowColor.r * blend);
            g = Math.round(baseColor.g * (1 - blend) + shadowColor.g * blend);
            b = Math.round(baseColor.b * (1 - blend) + shadowColor.b * blend);
          } else {
            // Base color for main text areas
            r = baseColor.r;
            g = baseColor.g;
            b = baseColor.b;
          }

          // Apply subtle radial tone variation for depth
          const radialVariation = Math.sin(distFromCenter * Math.PI) * 0.1;
          r = Math.max(0, Math.min(255, Math.round(r * (1 + radialVariation))));
          g = Math.max(0, Math.min(255, Math.round(g * (1 + radialVariation))));
          b = Math.max(0, Math.min(255, Math.round(b * (1 + radialVariation))));

          processedData[idx] = r;
          processedData[idx + 1] = g;
          processedData[idx + 2] = b;

          // Soften edges for natural minted appearance
          if (alpha > 0 && alpha < 255) {
            const edgeFactor = alpha / 255;
            const featheredAlpha = Math.pow(edgeFactor, 0.85); // Smooth edge transition
            processedData[idx + 3] = Math.floor(featheredAlpha * 255);
          }
        }
      }
    }

    const processedImageData = new ImageData(processedData, width, height);
    ctx.putImageData(processedImageData, 0, 0);

    // Generate enhanced normal map for subtle printed text lighting (visual depth only)
    // Reduced depth for flat printed appearance
    const normalCanvas = generateNormalMap(canvas, 0.5);
    const normalTexture = new THREE.CanvasTexture(normalCanvas);
    normalTexture.flipY = false;
    normalTexture.wrapS = THREE.ClampToEdgeWrapping;
    normalTexture.wrapT = THREE.ClampToEdgeWrapping;
    normalTexture.minFilter = THREE.LinearMipmapLinearFilter;
    normalTexture.magFilter = THREE.LinearFilter;
    normalTexture.generateMipmaps = true;
    normalTexture.anisotropy = 8; // Higher anisotropy for better quality
    normalTexture.colorSpace = THREE.SRGBColorSpace;

    // Generate roughness map for subtle surface variation (text slightly less reflective)
    const roughnessCanvas = document.createElement("canvas");
    roughnessCanvas.width = canvasSize;
    roughnessCanvas.height = canvasSize;
    const roughnessCtx = roughnessCanvas.getContext("2d");
    if (roughnessCtx) {
      // Create a subtle roughness variation - text areas slightly rougher for printed look
      const sourceImageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
      const sourceData = sourceImageData.data;
      const roughnessData = new Uint8ClampedArray(canvasSize * canvasSize * 4);

      for (let i = 0; i < sourceData.length; i += 4) {
        const alpha = sourceData[i + 3] / 255;
        // Text areas: slightly higher roughness (0.3-0.4), background: use base material
        const roughnessValue = alpha > 0.1 ? Math.floor(128 + alpha * 64) : 0; // 128-192 range
        roughnessData[i] = roughnessValue; // R
        roughnessData[i + 1] = roughnessValue; // G
        roughnessData[i + 2] = roughnessValue; // B
        roughnessData[i + 3] = 255; // A
      }

      const roughnessImageData = new ImageData(
        roughnessData,
        canvasSize,
        canvasSize,
      );
      roughnessCtx.putImageData(roughnessImageData, 0, 0);
    }

    const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
    roughnessTexture.flipY = false;
    roughnessTexture.wrapS = THREE.ClampToEdgeWrapping;
    roughnessTexture.wrapT = THREE.ClampToEdgeWrapping;
    roughnessTexture.minFilter = THREE.LinearMipmapLinearFilter;
    roughnessTexture.magFilter = THREE.LinearFilter;
    roughnessTexture.generateMipmaps = true;
    roughnessTexture.anisotropy = 8;

    // Create main texture from canvas (for color) with enhanced quality
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false; // GLB/GLTF uses bottom-left origin
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 8; // Higher anisotropy for better quality
    texture.colorSpace = THREE.SRGBColorSpace; // Preserve color accuracy

    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ Created printed text textures for ${side} ${position}: "${text}"`,
        {
          canvasSize,
          fontSize,
          color: textColors.base,
          materialId,
        },
      );
    }

    return {
      map: texture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
    };
  }, [text, color, fontSize, side, position, materialId]);

  // Apply textures to placeholder mesh - text is printed flat on coin surface
  useEffect(() => {
    if (!placeholderMesh) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Placeholder mesh not found for ${side} ${position} text area - text cannot be applied`,
        );
      }
      return;
    }

    if (!textures) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Textures not created for ${side} ${position} text (text: "${text}")`,
        );
      }
      // If no texture, make mesh transparent
      if (placeholderMesh.material instanceof THREE.MeshStandardMaterial) {
        const material = placeholderMesh.material.clone();
        material.transparent = true;
        material.opacity = 0;
        material.needsUpdate = true;
        placeholderMesh.material = material;
      }
      return;
    }

    const material = placeholderMesh.material;

    if (material instanceof THREE.MeshStandardMaterial) {
      // Clone material to avoid affecting other meshes
      const clonedMaterial = material.clone();

      // Apply color texture
      clonedMaterial.map = textures.map;
      clonedMaterial.map.flipY = false;

      // Apply subtle normal map for printed text surface detail (visual depth only, no geometry displacement)
      clonedMaterial.normalMap = textures.normalMap;
      clonedMaterial.normalMap.flipY = false;
      clonedMaterial.normalScale = new THREE.Vector2(0.5, 0.5); // Subtle normal effect for printed look

      // Apply roughness map for subtle surface variation (text slightly less reflective)
      if (textures.roughnessMap) {
        clonedMaterial.roughnessMap = textures.roughnessMap;
        clonedMaterial.roughnessMap.flipY = false;
        // Roughness map is multiplied with base roughness, so adjust base accordingly
        // The map will add subtle variation to the printed text areas
      }

      // NO displacement - text is printed flat on coin surface, not raised or floating
      clonedMaterial.displacementMap = null;
      clonedMaterial.displacementScale = 0;
      clonedMaterial.displacementBias = 0;

      // Material properties for printed metallic text on coin surface
      const isGold =
        materialId === "gold" ||
        materialId === "antique-gold" ||
        materialId === "copper" ||
        materialId === "bronze" ||
        materialId === "antique-bronze";
      const isSilver =
        materialId === "silver" || materialId === "antique-silver";

      // Set metallic properties for authentic printed coin text appearance
      // High metalness ensures text appears as part of the metal surface
      clonedMaterial.metalness = isGold || isSilver ? 0.97 : 0.88; // Very high metalness for integral metal appearance
      // Base roughness - roughness map will add subtle variation
      clonedMaterial.roughness = isGold ? 0.28 : isSilver ? 0.18 : 0.38; // Smooth metallic surface with slight variation

      // Use the material color for the cloned material
      // The text color is already optimized for each material type with realistic shading
      const materialColor = material.color;
      clonedMaterial.color = materialColor.clone(); // Use same base color as coin material

      // The text texture already has material-specific colors with realistic shading
      // applied in the texture generation, so no need to override the texture colors

      // Transparency and alpha handling for seamless blending with coin surface
      clonedMaterial.transparent = true; // Allow transparency for smooth edge blending
      clonedMaterial.opacity = 1;
      clonedMaterial.alphaTest = 0.05; // Lower threshold for smoother edge transitions

      // Enable depth writing for proper occlusion with coin surface
      clonedMaterial.depthWrite = true;
      clonedMaterial.depthTest = true;

      // Set material properties for printed text rendering
      clonedMaterial.side = THREE.FrontSide;
      clonedMaterial.flatShading = false; // Smooth shading for clean surfaces

      // Enable proper lighting for printed metallic text
      clonedMaterial.envMapIntensity = 1.3; // Enhanced reflections for realistic metallic printed text

      // Add subtle emissive component for better visibility (very subtle)
      clonedMaterial.emissive = new THREE.Color(0x000000);
      clonedMaterial.emissiveIntensity = 0; // No emission, just ensures proper setup

      clonedMaterial.needsUpdate = true;

      placeholderMesh.material = clonedMaterial;
      placeholderMesh.visible = true;

      // Ensure geometry normals are computed for proper lighting on printed text
      // This ensures text follows coin curvature correctly with proper surface normals
      if (placeholderMesh.geometry instanceof THREE.BufferGeometry) {
        placeholderMesh.geometry.computeVertexNormals();
      }

      if (process.env.NODE_ENV === "development") {
        console.log(
          `✅ Applied enhanced printed text textures to ${side} ${position} text area (${placeholderMesh.name})`,
          {
            text,
            color,
            fontSize,
            materialId,
            textureSize: `${textures.map.image.width}x${textures.map.image.height}`,
            hasNormalMap: !!textures.normalMap,
            hasRoughnessMap: !!textures.roughnessMap,
            hasDisplacementMap: false, // Disabled - text is flat on coin surface
            displacementScale: 0,
            normalScale: clonedMaterial.normalScale,
            hasRoughnessMapApplied: !!clonedMaterial.roughnessMap,
            metalness: clonedMaterial.metalness,
            roughness: clonedMaterial.roughness,
          },
        );
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Placeholder mesh material is not MeshStandardMaterial for ${side} ${position} text area`,
        );
      }
    }

    return () => {
      // Cleanup: dispose textures when component unmounts
      if (textures) {
        textures.map.dispose();
        textures.normalMap.dispose();
        if (textures.roughnessMap) {
          textures.roughnessMap.dispose();
        }
      }
      // Restore original material when component unmounts
      if (placeholderMesh && material) {
        placeholderMesh.material = material;
      }
    };
  }, [
    textures,
    placeholderMesh,
    side,
    position,
    text,
    color,
    fontSize,
    materialId,
  ]);

  // Return null - we're modifying the existing mesh, not creating a new one
  return null;
};
