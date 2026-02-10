"use client";
import React, { useMemo } from "react";
import * as THREE from "three";

interface CoinGeometryProps {
  diameter: number; // in mm, converted to Three.js units
  thickness: number; // in mm, converted to Three.js units
  edgeType: string;
}

/**
 * Creates parametric coin geometry based on dimensions and edge type
 */
export const createCoinGeometry = (
  diameter: number,
  thickness: number,
  edgeType: string,
): {
  frontFace: THREE.BufferGeometry;
  backFace: THREE.BufferGeometry;
  edge: THREE.BufferGeometry;
} => {
  const radius = diameter / 2;
  const segments = 64; // High resolution for smooth edges

  // Front and back faces (flat circles)
  const frontFace = new THREE.CircleGeometry(radius, segments);
  frontFace.rotateX(-Math.PI / 2); // Rotate to face up

  const backFace = new THREE.CircleGeometry(radius, segments);
  backFace.rotateX(Math.PI / 2); // Rotate to face down
  backFace.translate(0, -thickness, 0); // Position at bottom

  // Edge geometry based on edge type
  let edge: THREE.BufferGeometry;

  switch (edgeType) {
    case "smooth":
      // Smooth cylindrical edge
      edge = new THREE.CylinderGeometry(radius, radius, thickness, segments);
      edge.translate(0, -thickness / 2, 0);
      break;

    case "rope":
      // Rope edge - create a torus-like pattern
      edge = new THREE.CylinderGeometry(radius, radius, thickness, segments);
      // Add rope texture via normal map (handled in material)
      edge.translate(0, -thickness / 2, 0);
      break;

    case "oblique": {
      // Oblique edge - angled cylinder
      const obliqueRadius = radius * 0.98;
      edge = new THREE.CylinderGeometry(
        obliqueRadius,
        radius,
        thickness,
        segments,
      );
      edge.translate(0, -thickness / 2, 0);
      break;
    }

    case "diamond":
      // Diamond pattern edge - use lower segments for faceted look
      edge = new THREE.CylinderGeometry(radius, radius, thickness, 32);
      edge.translate(0, -thickness / 2, 0);
      break;

    case "grid-pattern":
      // Grid pattern - smooth cylinder (pattern via texture)
      edge = new THREE.CylinderGeometry(radius, radius, thickness, segments);
      edge.translate(0, -thickness / 2, 0);
      break;

    case "curve-wave":
      // Curve wave - smooth cylinder (wave pattern via texture)
      edge = new THREE.CylinderGeometry(radius, radius, thickness, segments);
      edge.translate(0, -thickness / 2, 0);
      break;

    default:
      edge = new THREE.CylinderGeometry(radius, radius, thickness, segments);
      edge.translate(0, -thickness / 2, 0);
  }

  return { frontFace, backFace, edge };
};

/**
 * React component that creates and manages coin geometry
 */
export const CoinGeometry: React.FC<CoinGeometryProps> = ({
  diameter,
  thickness,
  edgeType,
}) => {
  // Create geometries (used by parent components)
  useMemo(
    () => createCoinGeometry(diameter, thickness, edgeType),
    [diameter, thickness, edgeType],
  );

  return null; // This is a utility component, geometry is returned
};
