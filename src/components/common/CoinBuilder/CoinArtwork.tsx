"use client";
import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

interface CoinArtworkProps {
  imageUrl: string | null;
  side: "front" | "back";
  radius: number;
  position: [number, number, number] | null;
  reliefType?: "flat" | "embossed" | "engraved";
  placeholderMesh?: THREE.Mesh | null; // Pass the actual placeholder mesh from parent
}

/**
 * Maps artwork image to coin face placeholder mesh with optional relief effects
 * The image is applied directly to the placeholder mesh material
 */
export const CoinArtwork: React.FC<CoinArtworkProps> = ({
  imageUrl,
  side,
  radius,
  position,
  reliefType = "flat",
  placeholderMesh,
}) => {
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const [alphaMap, setAlphaMap] = React.useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null);
      setAlphaMap(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.flipY = false;
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        // CRITICAL: Preserve original sRGB color space
        loadedTexture.colorSpace = THREE.SRGBColorSpace;

        // Get image dimensions
        const image = loadedTexture.image as
          | HTMLImageElement
          | HTMLCanvasElement
          | HTMLVideoElement
          | ImageBitmap
          | null;
        const imageElement = image instanceof HTMLImageElement ? image : null;

        if (!imageElement) {
          setTexture(loadedTexture);
          return;
        }

        const imageAspect = imageElement.width / imageElement.height;
        // Use high resolution for better quality circular mask
        const size = Math.max(imageElement.width, imageElement.height);
        // Ensure minimum size for quality
        const canvasSize = Math.max(size, 512);

        // Create a canvas to apply circular mask and fill the entire circle
        const canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          setTexture(loadedTexture);
          return;
        }

        // Enable image smoothing for better quality
        // Use pixel-perfect rendering to preserve exact colors
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        // Ensure no color space conversion during canvas operations
        // Canvas operations preserve original pixel colors

        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        // Use full canvas size as radius to maximize circular area
        const circleRadius = canvasSize;

        // STEP 1: Create image texture in COVER mode (no masking)
        // Scale image uniformly to completely fill the circular area with no gaps
        // The image will be scaled so the smaller dimension fills the circle diameter
        // The larger dimension will extend beyond and be clipped by the alpha map
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Calculate scale to ensure image completely covers the circle
        // Use the larger scale factor to guarantee full coverage
        const scaleX = canvasSize / imageElement.width;
        const scaleY = canvasSize / imageElement.height;
        const scale = Math.max(scaleX, scaleY); // Use larger scale to ensure full coverage

        // Calculate dimensions after scaling
        const drawWidth = imageElement.width * scale;
        const drawHeight = imageElement.height * scale;

        // Center the image (may extend beyond canvas boundaries - that's OK for cover mode)
        const drawX = (canvasSize - drawWidth) / 2;
        const drawY = (canvasSize - drawHeight) / 2;

        // Draw the full scaled image (cover mode - fills entire circle, may extend beyond)
        // This ensures no empty margins, padding, or gaps within the circular area
        ctx.drawImage(imageElement, drawX, drawY, drawWidth, drawHeight);

        // Create image texture (full image, no masking)
        const imageTexture = new THREE.CanvasTexture(canvas);
        imageTexture.flipY = false;
        imageTexture.wrapS = THREE.ClampToEdgeWrapping;
        imageTexture.wrapT = THREE.ClampToEdgeWrapping;
        imageTexture.minFilter = THREE.LinearMipmapLinearFilter;
        imageTexture.magFilter = THREE.LinearFilter;
        imageTexture.generateMipmaps = true;
        // CRITICAL: Preserve sRGB color space - do not convert to linear
        imageTexture.colorSpace = THREE.SRGBColorSpace;
        imageTexture.needsUpdate = true;

        setTexture(imageTexture);

        // STEP 2: Create separate alpha map texture (white circle on transparent background)
        const alphaCanvas = document.createElement("canvas");
        alphaCanvas.width = canvasSize;
        alphaCanvas.height = canvasSize;
        const alphaCtx = alphaCanvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (alphaCtx) {
          // Clear with transparent background
          alphaCtx.clearRect(0, 0, canvasSize, canvasSize);

          // Create perfect white circle on transparent background
          // White = fully opaque (alpha = 1), transparent = fully transparent (alpha = 0)
          alphaCtx.fillStyle = "white";
          alphaCtx.beginPath();
          alphaCtx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
          alphaCtx.fill();

          // Create alpha map texture
          const alphaMapTexture = new THREE.CanvasTexture(alphaCanvas);
          alphaMapTexture.flipY = false;
          alphaMapTexture.wrapS = THREE.ClampToEdgeWrapping;
          alphaMapTexture.wrapT = THREE.ClampToEdgeWrapping;
          alphaMapTexture.minFilter = THREE.LinearMipmapLinearFilter;
          alphaMapTexture.magFilter = THREE.LinearFilter;
          alphaMapTexture.generateMipmaps = true;
          // Alpha maps don't need color space conversion
          alphaMapTexture.needsUpdate = true;

          setAlphaMap(alphaMapTexture);
        }
      },
      undefined,
      (error) => {
        console.error("Failed to load artwork:", error);
        setTexture(null);
        setAlphaMap(null);
      },
    );
  }, [imageUrl]);

  // Apply texture directly to the placeholder mesh material
  useEffect(() => {
    if (!placeholderMesh) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Placeholder mesh not found for ${side} side - artwork cannot be applied`,
        );
      }
      return;
    }

    if (!texture || !alphaMap) {
      if (process.env.NODE_ENV === "development") {
        if (!texture) {
          console.warn(`⚠️ Texture not loaded for ${side} side artwork`);
        }
        if (!alphaMap) {
          console.warn(`⚠️ Alpha map not loaded for ${side} side artwork`);
        }
      }
      return;
    }

    const material = placeholderMesh.material;

    // CRITICAL: Use MeshBasicMaterial for lighting-independent artwork rendering
    // MeshBasicMaterial displays textures exactly as provided, unaffected by scene lighting
    // This ensures artwork colors remain identical to the source image

    // Ensure texture color space is preserved
    if (texture.colorSpace !== THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }

    // Create a new MeshBasicMaterial (lighting-independent)
    // RECOMMENDED APPROACH: Circular Mask via Alpha Map (Option A)
    // This preserves performance and visual quality
    // Reference: material.map = imageTexture, material.alphaMap = circleMaskTexture, material.transparent = true
    const artworkMaterial = new THREE.MeshBasicMaterial({
      map: texture, // Full image texture in cover mode (no masking on image itself)
      alphaMap: alphaMap, // Circular alpha mask (white circle = opaque, transparent = transparent)
      // Enable transparency to use alphaMap (REQUIRED for alphaMap to work)
      transparent: true,
      opacity: 1,
      // Use low alphaTest for smooth edges (alphaMap handles the circular shape)
      alphaTest: 0.01,
      // CRITICAL: White base color (1,1,1) = no color tinting
      // This ensures the texture colors are displayed exactly as provided
      color: new THREE.Color(1.0, 1.0, 1.0),
      // Disable tone mapping to prevent any color shifts
      toneMapped: false, // Prevents tone mapping from altering artwork colors
      // Side: DoubleSide to ensure visibility from both angles
      side: THREE.DoubleSide,
    });

    // Note: Relief effects (embossed/engraved) are not applied with MeshBasicMaterial
    // as they require lighting-dependent materials. For color preservation, we prioritize
    // exact color matching over relief effects. If relief is needed, it would require
    // a different approach that maintains color accuracy.

    placeholderMesh.material = artworkMaterial;
    placeholderMesh.visible = true;

    if (process.env.NODE_ENV === "development") {
      // Type guard for texture image to access width and height
      const image = texture.image as
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement
        | ImageBitmap
        | null;
      const imageElement = image instanceof HTMLImageElement ? image : null;
      const textureSize = imageElement
        ? `${imageElement.width}x${imageElement.height}`
        : "unknown";
      const aspectRatio = imageElement
        ? (imageElement.width / imageElement.height).toFixed(2)
        : "unknown";

      console.log(
        `✅ Applied lighting-independent artwork texture to ${side} image placeholder (${placeholderMesh.name})`,
        {
          materialType: "MeshBasicMaterial (lighting-independent)",
          textureSize,
          aspectRatio,
          colorSpace: texture.colorSpace,
          toneMapped: artworkMaterial.toneMapped,
        },
      );
    }
    // Material is now MeshBasicMaterial (lighting-independent)
    // No need to check material type since we create a new one

    return () => {
      // Cleanup: dispose of artwork material and restore original material when component unmounts
      if (placeholderMesh) {
        // Dispose of the artwork material to free memory
        if (placeholderMesh.material instanceof THREE.Material) {
          placeholderMesh.material.dispose();
        }
        // Restore original material if available
        if (material) {
          placeholderMesh.material = material;
        }
      }
    };
  }, [
    texture?.uuid ?? null,
    alphaMap?.uuid ?? null,
    placeholderMesh?.uuid ?? null,
    side,
    reliefType,
  ]);

  // Return null - we're modifying the existing mesh, not creating a new one
  return null;
};
