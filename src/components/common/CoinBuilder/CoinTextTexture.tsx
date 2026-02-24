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
 * Creates a canvas texture from text and applies it to the placeholder mesh
 * Similar to CoinArtwork but for text rendering
 */
export const CoinTextTexture: React.FC<CoinTextTextureProps> = ({
  text,
  side,
  position,
  color = "#000000",
  fontSize = 48,
  placeholderMesh,
  materialId = "gold",
}) => {
  // Generate canvas texture from text
  const texture = useMemo(() => {
    if (!text || !text.trim()) {
      return null;
    }

    // Create canvas with high resolution for crisp text
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Set canvas size - use power of 2 for better texture performance
    const canvasSize = 512; // High resolution for crisp text
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Configure text rendering
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;

    // Add text shadow for better visibility and depth effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Draw text in center of canvas
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;

    // Draw text with outline for better visibility
    ctx.lineWidth = 2;
    ctx.strokeText(text, centerX, centerY);
    ctx.fillText(text, centerX, centerY);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false; // GLB/GLTF uses bottom-left origin
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 4;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ Created text texture for ${side} ${position}: "${text}"`,
        {
          canvasSize,
          fontSize,
          color,
        },
      );
    }

    return texture;
  }, [text, color, fontSize, side, position]);

  // Apply texture to placeholder mesh
  useEffect(() => {
    if (!placeholderMesh) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Placeholder mesh not found for ${side} ${position} text area - text cannot be applied`,
        );
      }
      return;
    }

    if (!texture) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Texture not created for ${side} ${position} text (text: "${text}")`,
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
      clonedMaterial.map = texture;
      clonedMaterial.transparent = true; // Allow transparency for text edges
      clonedMaterial.opacity = 1;
      clonedMaterial.alphaTest = 0.1; // Discard pixels with low alpha for cleaner edges
      clonedMaterial.needsUpdate = true;

      // Set material properties for text rendering
      clonedMaterial.side = THREE.FrontSide;
      clonedMaterial.flatShading = false;

      placeholderMesh.material = clonedMaterial;
      placeholderMesh.visible = true;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `✅ Applied text texture to ${side} ${position} text area (${placeholderMesh.name})`,
          {
            text,
            color,
            fontSize,
            textureSize: `${texture.image.width}x${texture.image.height}`,
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
      // Cleanup: dispose texture when component unmounts
      if (texture) {
        texture.dispose();
      }
      // Restore original material when component unmounts
      if (placeholderMesh && material) {
        placeholderMesh.material = material;
      }
    };
  }, [texture, placeholderMesh, side, position, text, color, fontSize]);

  // Return null - we're modifying the existing mesh, not creating a new one
  return null;
};
