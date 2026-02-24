"use client";
import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DynamicLightingProps {
  // Optional: can be controlled externally
}

/**
 * Physically balanced lighting system with:
 * - Symmetrical base lighting for front and back sides
 * - Enhanced dynamic lighting on front side based on camera view
 * - Smooth transitions and realistic material responses
 */
export const DynamicLighting: React.FC<DynamicLightingProps> = () => {
  const { camera } = useThree();

  // Base lighting refs (symmetrical for front and back)
  const frontKeyLightRef = useRef<THREE.DirectionalLight>(null);
  const backKeyLightRef = useRef<THREE.DirectionalLight>(null);
  const frontFillLightRef = useRef<THREE.DirectionalLight>(null);
  const backFillLightRef = useRef<THREE.DirectionalLight>(null);
  const frontRimLightRef = useRef<THREE.DirectionalLight>(null);
  const backRimLightRef = useRef<THREE.DirectionalLight>(null);

  // Enhanced dynamic front-side lights
  const frontDirectLightRef = useRef<THREE.DirectionalLight>(null);
  const frontTopLightRef = useRef<THREE.DirectionalLight>(null);
  const frontCenterLightRef = useRef<THREE.DirectionalLight>(null);

  // Ambient light intensity state for smooth transitions
  const [ambientIntensity, setAmbientIntensity] = useState(1.8);

  // Track camera position and calculate view angle
  useFrame(() => {
    if (!camera) return;

    // Convert camera position to spherical coordinates
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position);

    // Normalize azimuth angle to 0-2π range
    let azimuth = spherical.theta;
    if (azimuth < 0) azimuth += Math.PI * 2;

    // Determine if viewing back side
    const viewingBack = azimuth > Math.PI / 2 && azimuth < (3 * Math.PI) / 2;
    const cameraBehind = camera.position.z < 0;
    const isBackSide = viewingBack || cameraBehind;

    // Calculate view factor (0 = back side, 1 = front side) for smooth transitions
    const viewFactor = isBackSide ? 0 : 1;

    // Smooth lerp factor for gradual transitions
    const lerpFactor = 0.1;

    // Base symmetrical lighting - equal intensity for both sides
    const baseKeyIntensity = 2.0;
    const baseFillIntensity = 1.5;
    const baseRimIntensity = 1.2;

    // Enhanced front-side lighting (only active when viewing front)
    const enhancedFrontIntensity = 2.5; // Additional boost for front side
    const frontDirectIntensity =
      baseKeyIntensity + enhancedFrontIntensity * viewFactor;
    const frontTopIntensity =
      baseFillIntensity + enhancedFrontIntensity * 0.8 * viewFactor;
    const frontCenterIntensity =
      baseKeyIntensity + enhancedFrontIntensity * 1.2 * viewFactor;

    // Update front base lights
    if (frontKeyLightRef.current) {
      const targetIntensity =
        baseKeyIntensity + enhancedFrontIntensity * 0.6 * viewFactor;
      frontKeyLightRef.current.intensity = THREE.MathUtils.lerp(
        frontKeyLightRef.current.intensity,
        targetIntensity,
        lerpFactor,
      );
    }

    if (frontFillLightRef.current) {
      const targetIntensity =
        baseFillIntensity + enhancedFrontIntensity * 0.4 * viewFactor;
      frontFillLightRef.current.intensity = THREE.MathUtils.lerp(
        frontFillLightRef.current.intensity,
        targetIntensity,
        lerpFactor,
      );
    }

    if (frontRimLightRef.current) {
      const targetIntensity =
        baseRimIntensity + enhancedFrontIntensity * 0.3 * viewFactor;
      frontRimLightRef.current.intensity = THREE.MathUtils.lerp(
        frontRimLightRef.current.intensity,
        targetIntensity,
        lerpFactor,
      );
    }

    // Update back base lights (always at base intensity for symmetry)
    if (backKeyLightRef.current) {
      backKeyLightRef.current.intensity = THREE.MathUtils.lerp(
        backKeyLightRef.current.intensity,
        baseKeyIntensity,
        lerpFactor,
      );
    }

    if (backFillLightRef.current) {
      backFillLightRef.current.intensity = THREE.MathUtils.lerp(
        backFillLightRef.current.intensity,
        baseFillIntensity,
        lerpFactor,
      );
    }

    if (backRimLightRef.current) {
      backRimLightRef.current.intensity = THREE.MathUtils.lerp(
        backRimLightRef.current.intensity,
        baseRimIntensity,
        lerpFactor,
      );
    }

    // Enhanced dynamic front-side lights (smoothly fade in/out based on view)
    if (frontDirectLightRef.current) {
      frontDirectLightRef.current.intensity = THREE.MathUtils.lerp(
        frontDirectLightRef.current.intensity,
        frontDirectIntensity,
        lerpFactor,
      );
    }

    if (frontTopLightRef.current) {
      frontTopLightRef.current.intensity = THREE.MathUtils.lerp(
        frontTopLightRef.current.intensity,
        frontTopIntensity,
        lerpFactor,
      );
    }

    if (frontCenterLightRef.current) {
      frontCenterLightRef.current.intensity = THREE.MathUtils.lerp(
        frontCenterLightRef.current.intensity,
        frontCenterIntensity,
        lerpFactor,
      );
    }

    // Adjust ambient light slightly based on view (subtle enhancement)
    const targetAmbient = 1.8 + 0.3 * viewFactor;
    setAmbientIntensity((prev) =>
      THREE.MathUtils.lerp(prev, targetAmbient, lerpFactor),
    );
  });

  return (
    <>
      {/* Ambient Light - Enhanced for better visibility, neutral tone */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight intensity={ambientIntensity} />

      {/* ============================================ */}
      {/* SYMMETRICAL BASE LIGHTING */}
      {/* ============================================ */}
      {/* Front Side Base Lights */}
      {/* Key Light - Main illumination (front) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontKeyLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 12, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Fill Light - Soft fill (front) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontFillLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 10, 6]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xfff5e6} // Warm fill
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Rim Light - Edge definition (front) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontRimLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -8, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xe0f2fe} // Cool rim light
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Back Side Base Lights - Symmetrical to front */}
      {/* Key Light - Main illumination (back) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={backKeyLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, 12, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Fill Light - Soft fill (back) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={backFillLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 10, -6]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.5}
        color={0xfff5e6} // Warm fill
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Rim Light - Edge definition (back) */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={backRimLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -8, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xe0f2fe} // Cool rim light
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* ============================================ */}
      {/* ENHANCED DYNAMIC FRONT-SIDE LIGHTING */}
      {/* ============================================ */}
      {/* These lights enhance front-side visibility and detail */}

      {/* Front Direct Light - Maximum brightness for front center */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        ref={frontDirectLightRef}
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 0, 15]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={2.0}
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
        intensity={1.5}
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
        intensity={2.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* ============================================ */}
      {/* SUPPLEMENTARY LIGHTING FOR COMPLETE COVERAGE */}
      {/* ============================================ */}
      {/* Top lights - Even spread from above */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 15, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 15, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 15, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 15, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.2}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Side lights - Left and right for edge coverage */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[15, 8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-15, 8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[15, -8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-15, -8, 0]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Diagonal lights - Cover corners and edges */}
      {/* Front diagonal lights */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, 10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, -10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, -10, 10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Back diagonal lights - Symmetrical to front */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, 10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, 10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[10, -10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-10, -10, -10]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={1.0}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Mid-level spread lights - Additional coverage */}
      {/* Front side */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 0, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Back side - Symmetrical */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[8, 0, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[-8, 0, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />

      {/* Vertical spread lights */}
      {/* Front side */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 10, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -10, 12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* Back side - Symmetrical */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, 10, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -10, -12]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.8}
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
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -15, 8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight
        // eslint-disable-next-line react/no-unknown-property
        position={[0, -15, -8]}
        // eslint-disable-next-line react/no-unknown-property
        intensity={0.6}
        color={0xffffff}
        // eslint-disable-next-line react/no-unknown-property
        castShadow={false}
      />
    </>
  );
};
