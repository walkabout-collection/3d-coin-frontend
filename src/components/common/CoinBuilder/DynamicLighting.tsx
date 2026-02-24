"use client";
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DynamicLightingProps {
  // Optional: can be controlled externally
}

/**
 * Dynamic lighting that adjusts based on camera/view angle
 * Flips lighting direction when viewing the back side of the coin
 */
export const DynamicLighting: React.FC<DynamicLightingProps> = () => {
  const { camera } = useThree();
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  // Track camera position to determine if viewing front or back
  useFrame(() => {
    if (!camera) return;

    // Convert camera position to spherical coordinates
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position);

    // Normalize azimuth angle to 0-2π range
    let azimuth = spherical.theta;
    if (azimuth < 0) azimuth += Math.PI * 2;

    // Determine if viewing back side
    // Front side: azimuth between -π/2 and π/2 (or 3π/2 to 2π and 0 to π/2)
    // Back side: azimuth between π/2 and 3π/2
    // Simplified: if azimuth is between 90° and 270° (π/2 to 3π/2), we're viewing back
    const viewingBack = azimuth > Math.PI / 2 && azimuth < (3 * Math.PI) / 2;

    // Also check Z position as backup (if camera is behind the coin)
    const cameraBehind = camera.position.z < 0;
    const isBackSide = viewingBack || cameraBehind;

    // Adjust light positions based on view - optimized for front side visibility
    // Front side: lighting from angles that properly illuminate the front face
    // Back side: lighting from opposite angles
    if (keyLightRef.current) {
      const targetPos = isBackSide
        ? new THREE.Vector3(-12, 12, -4) // Back side: from top-left-back
        : new THREE.Vector3(10, 12, 8); // Front side: from top-right-front (illuminates front properly)

      keyLightRef.current.position.lerp(targetPos, 0.15);
    }

    if (fillLightRef.current) {
      const targetPos = isBackSide
        ? new THREE.Vector3(10, 10, -2) // Back side: from right-back
        : new THREE.Vector3(-8, 10, 6); // Front side: from top-left-front (soft fill for front)

      fillLightRef.current.position.lerp(targetPos, 0.15);
    }

    if (rimLightRef.current) {
      const targetPos = isBackSide
        ? new THREE.Vector3(0, -8, 8) // Back side: rim from front
        : new THREE.Vector3(0, -8, -8); // Front side: rim from back (defines front edges)

      rimLightRef.current.position.lerp(targetPos, 0.15);
    }
  });

  return (
    <>
      {/* Ambient Light - Increased for better front visibility */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight intensity={0.6} />

      {/* Key Light - Main illumination (front: top-right-front, back: top-left-back) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={keyLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 12, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Fill Light - Soft fill (front: top-left-front, back: right-back) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={fillLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 10, 6]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xfff5e6} // Warm fill
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Rim Light - Edge definition (front: from back, back: from front) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={rimLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -8, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xe0f2fe} // Cool rim light
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Top Light - From top-left to avoid center hotspot */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[6, 12, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Side Lights - Left and right for better edge visibility, angled to avoid center */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[12, 6, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-12, 6, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
    </>
  );
};
