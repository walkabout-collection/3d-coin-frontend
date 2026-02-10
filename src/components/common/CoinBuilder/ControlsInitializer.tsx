"use client";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Component to initialize OrbitControls to show front side by default
 */
export const ControlsInitializer: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.RefObject<any>;
}> = ({ controlsRef }) => {
  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !controlsRef.current) return;

    const controls = controlsRef.current;

    // Set initial camera position to show front side
    // Use spherical coordinates: azimuth 0 = front, polar slightly elevated
    const spherical = new THREE.Spherical();
    spherical.radius = 10; // Distance from center
    spherical.theta = 0; // Azimuth: 0 = front, π = back
    spherical.phi = Math.PI / 2.2; // Polar: slightly above horizontal (π/2 = horizontal)

    // Convert to cartesian and set camera position
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);
    camera.position.copy(position);
    camera.lookAt(0, 0, 0);

    // Update controls
    controls.update();
    initialized.current = true;
  }, [camera, controlsRef]);

  return null;
};
