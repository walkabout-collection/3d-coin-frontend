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
  const frontDirectLightRef = useRef<THREE.DirectionalLight>(null);
  const frontTopLightRef = useRef<THREE.DirectionalLight>(null);
  const frontCenterLightRef = useRef<THREE.DirectionalLight>(null);

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

    // Adjust light positions and intensities based on view - optimized for front side brightness
    // Front side: maximum brightness with multiple direct lights
    // Back side: normal brightness
    if (keyLightRef.current) {
      const targetPos = isBackSide
        ? new THREE.Vector3(-12, 12, -4) // Back side: from top-left-back
        : new THREE.Vector3(10, 12, 8); // Front side: from top-right-front

      keyLightRef.current.position.lerp(targetPos, 0.15);
      // Maximum brightness for front side
      keyLightRef.current.intensity = isBackSide ? 1.5 : 4.5;
    }

    if (fillLightRef.current) {
      const targetPos = isBackSide
        ? new THREE.Vector3(10, 10, -2) // Back side: from right-back
        : new THREE.Vector3(-8, 10, 6); // Front side: from top-left-front

      fillLightRef.current.position.lerp(targetPos, 0.15);
      // Maximum brightness for front side
      fillLightRef.current.intensity = isBackSide ? 1.0 : 3.5;
    }

    if (rimLightRef.current) {
      const targetPos = isBackSide
        ? new THREE.Vector3(0, -8, 8) // Back side: rim from front
        : new THREE.Vector3(0, -8, -8); // Front side: rim from back

      rimLightRef.current.position.lerp(targetPos, 0.15);
      // Maximum brightness for front side
      rimLightRef.current.intensity = isBackSide ? 0.8 : 2.5;
    }

    // Direct front lights - maximum intensity for front side visibility, especially center
    if (frontDirectLightRef.current) {
      frontDirectLightRef.current.intensity = isBackSide ? 0.5 : 6.5;
    }
    if (frontTopLightRef.current) {
      frontTopLightRef.current.intensity = isBackSide ? 0.4 : 4.5;
    }
    if (frontCenterLightRef.current) {
      frontCenterLightRef.current.intensity = isBackSide ? 0.4 : 6.5;
    }
  });

  return (
    <>
      {/* Ambient Light - Increased for bright front side */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight intensity={2.5} />

      {/* Key Light - Main illumination (front: top-right-front, back: top-left-back) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={keyLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 12, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={4.5}
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
        intensity={3.5}
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
        intensity={2.5}
        color={0xe0f2fe} // Cool rim light
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Direct Front Light - Maximum brightness for front side center */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontDirectLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 0, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={6.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Front Top Light - Additional light from top-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontTopLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 15, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={4.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Front Center Light - Direct center illumination */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontCenterLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={6.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Center-Focused Lights - Multiple lights targeting the FRONT center area (all positive Z) */}
      {/* Center from very close - directly in front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 0, 22]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={6.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from top-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 18, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from bottom-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -18, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from left-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-18, 0, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from right-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[18, 0, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from diagonal positions - top-right-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[12, 12, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={4.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from diagonal positions - top-left-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-12, 12, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={4.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from diagonal positions - bottom-right-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[12, -12, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={4.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Center from diagonal positions - bottom-left-front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-12, -12, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={4.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Additional center-focused lights - very close to front center */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 2, 18]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -2, 18]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[2, 0, 18]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-2, 0, 18]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Top Lights - Multiple angles for even spread across coin, brighter for front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 15, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 15, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 15, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 15, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Side Lights - Left and right for even edge coverage */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[15, 8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.7}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-15, 8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.7}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[15, -8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.7}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-15, -8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.7}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Additional Front Light - Extra brightness for front side center */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 0, 18]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={5.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Circular Pattern Lights - Front Side - Inner Circle (8 lights evenly spaced) */}
      {/* These lights form a circle around the front side for even spread */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[12, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8.5, 8.5, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 12, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8.5, 8.5, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-12, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8.5, -8.5, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -12, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8.5, -8.5, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Circular Pattern Lights - Front Side - Outer Circle (12 lights evenly spaced) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[15, 0, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[13, 7.5, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[7.5, 13, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 15, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-7.5, 13, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-13, 7.5, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-15, 0, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-13, -7.5, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-7.5, -13, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -15, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[7.5, -13, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[13, -7.5, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Circular Pattern Lights - Front Side - Close Circle (8 lights for center coverage) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 0, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[5.7, 5.7, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 8, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-5.7, 5.7, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 0, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-5.7, -5.7, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -8, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[5.7, -5.7, 14]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Back Light - Normal intensity */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 0, -15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.9}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Diagonal Lights - Cover corners and edges from multiple angles */}
      {/* Front diagonal lights - Brighter for front side spread */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, 10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, -10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, -10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Back diagonal lights */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, 10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, -10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, -10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Mid-level spread lights - Additional coverage, brighter for front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 0, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 0, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Vertical spread lights - Brighter for front side */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 10, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -10, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 10, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -10, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Bottom lights - Cover from below */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -15, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -15, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -15, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.5}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
    </>
  );
};
