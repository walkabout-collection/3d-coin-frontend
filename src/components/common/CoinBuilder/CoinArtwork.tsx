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

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.flipY = false;
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;

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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Create circular clipping path first
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        const circleRadius = canvasSize / 2;

        // Start with circular clipping path to ensure perfect circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
        ctx.clip();

        // Calculate image positioning to fill the entire circle while maintaining aspect ratio
        // Strategy: Scale image to cover the entire circle (cover mode, not fit mode)
        let drawX = 0;
        let drawY = 0;
        let drawWidth = canvasSize;
        let drawHeight = canvasSize;

        if (imageAspect > 1) {
          // Image is wider than tall - scale to cover width, may crop top/bottom
          drawHeight = canvasSize / imageAspect;
          drawY = (canvasSize - drawHeight) / 2;
        } else if (imageAspect < 1) {
          // Image is taller than wide - scale to cover height, may crop left/right
          drawWidth = canvasSize * imageAspect;
          drawX = (canvasSize - drawWidth) / 2;
        }
        // If square, no adjustment needed

        // Draw the image onto the canvas (will be clipped to circle)
        ctx.drawImage(imageElement, drawX, drawY, drawWidth, drawHeight);

        // Apply additional circular mask using composite operation for clean edges
        // This ensures perfect circular shape with anti-aliasing
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = canvasSize;
        maskCanvas.height = canvasSize;
        const maskCtx = maskCanvas.getContext("2d");

        if (maskCtx) {
          // Create white circle on transparent background
          maskCtx.fillStyle = "white";
          maskCtx.beginPath();
          maskCtx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
          maskCtx.fill();

          // Apply mask using destination-in to keep only the circular area
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(maskCanvas, 0, 0);
          ctx.globalCompositeOperation = "source-over";
        }

        // Create texture from the circular canvas
        const circularTexture = new THREE.CanvasTexture(canvas);
        circularTexture.flipY = false;
        circularTexture.wrapS = THREE.ClampToEdgeWrapping;
        circularTexture.wrapT = THREE.ClampToEdgeWrapping;
        circularTexture.minFilter = THREE.LinearMipmapLinearFilter;
        circularTexture.magFilter = THREE.LinearFilter;
        circularTexture.generateMipmaps = true;
        circularTexture.needsUpdate = true;

        setTexture(circularTexture);
      },
      undefined,
      (error) => {
        console.error("Failed to load artwork:", error);
        setTexture(null);
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

    if (!texture) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`⚠️ Texture not loaded for ${side} side artwork`);
      }
      return;
    }

    const material = placeholderMesh.material;

    if (material instanceof THREE.MeshStandardMaterial) {
      // Clone material to avoid affecting other meshes
      const clonedMaterial = material.clone();
      clonedMaterial.map = texture;
      // Enable transparency to show circular mask edges
      clonedMaterial.transparent = true;
      clonedMaterial.opacity = 1;
      // Use alphaTest to ensure clean circular edges
      clonedMaterial.alphaTest = 0.01;
      // Adjust material properties for natural image visibility
      clonedMaterial.metalness = 0.0;
      clonedMaterial.roughness = 0.7;
      clonedMaterial.emissive = new THREE.Color(0.0, 0.0, 0.0);
      clonedMaterial.emissiveIntensity = 0.0;
      clonedMaterial.color = new THREE.Color(1.0, 1.0, 1.0);
      clonedMaterial.needsUpdate = true;

      if (reliefType === "embossed") {
        clonedMaterial.normalMap = texture;
        clonedMaterial.normalScale = new THREE.Vector2(0.5, 0.5);
      } else if (reliefType === "engraved") {
        clonedMaterial.color = new THREE.Color(0.7, 0.7, 0.7);
      }

      placeholderMesh.material = clonedMaterial;
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
          `✅ Applied artwork texture to ${side} image placeholder (${placeholderMesh.name})`,
          {
            textureSize,
            aspectRatio,
            repeat: `(${texture.repeat.x.toFixed(2)}, ${texture.repeat.y.toFixed(2)})`,
            offset: `(${texture.offset.x.toFixed(2)}, ${texture.offset.y.toFixed(2)})`,
          },
        );
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Placeholder mesh material is not MeshStandardMaterial for ${side} side`,
        );
      }
    }

    return () => {
      // Cleanup: restore original material when component unmounts
      if (placeholderMesh && material) {
        placeholderMesh.material = material;
      }
    };
  }, [texture, placeholderMesh, side, reliefType]);

  // Return null - we're modifying the existing mesh, not creating a new one
  return null;
};
