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

        // Center the texture on the placeholder mesh
        // The placeholder mesh should have centered UVs (0.5, 0.5 is center)
        // We want to fit the image to cover the placeholder while maintaining aspect ratio
        // Type guard for texture image to access width and height
        const image = loadedTexture.image as
          | HTMLImageElement
          | HTMLCanvasElement
          | HTMLVideoElement
          | ImageBitmap
          | null;
        const imageElement = image instanceof HTMLImageElement ? image : null;
        const imageAspect = imageElement
          ? imageElement.width / imageElement.height
          : 1;

        // Placeholder mesh is circular/square (1:1 aspect ratio)
        // Strategy: Fit image to cover the entire placeholder area, centered
        if (imageAspect > 1) {
          // Image is wider than tall - fit to height, center horizontally
          const scale = 1; // Use full height
          loadedTexture.repeat.set(scale / imageAspect, scale);
          loadedTexture.offset.set((1 - scale / imageAspect) / 2, 0);
        } else if (imageAspect < 1) {
          // Image is taller than wide - fit to width, center vertically
          const scale = 1; // Use full width
          loadedTexture.repeat.set(scale, scale * imageAspect);
          loadedTexture.offset.set(0, (1 - scale * imageAspect) / 2);
        } else {
          // Image is square - perfect fit, no offset needed
          loadedTexture.repeat.set(1, 1);
          loadedTexture.offset.set(0, 0);
        }

        // Ensure texture is centered (UV coordinates should be centered at 0.5, 0.5)
        // If the placeholder mesh UVs are already centered, this should work
        // If not, we may need to adjust based on the actual UV layout

        setTexture(loadedTexture);
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
      clonedMaterial.transparent = false;
      clonedMaterial.opacity = 1;
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
