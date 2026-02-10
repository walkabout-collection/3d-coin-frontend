"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Simple test component to verify 3D rendering works
function TestCoin() {
  const { scene } = useGLTF("/Coin/Coin Glb Model.glb");

  React.useEffect(() => {
    if (scene) {
      console.log("✅ GLB loaded! Children:", scene.children.length);

      // Make everything visible
      scene.traverse((child) => {
        child.visible = true;
        if (child instanceof THREE.Mesh) {
          console.log("Mesh:", child.name, "visible:", child.visible);
        }
      });

      // Get bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      console.log("Model size:", size);
      console.log("Model center:", center);
    }
  }, [scene]);

  if (!scene) {
    return (
      // eslint-disable-next-line react/no-unknown-property
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  // eslint-disable-next-line react/no-unknown-property
  return <primitive object={scene} scale={1} />;
}

export default function Coin3DViewerTest() {
  return (
    <div className="w-full h-[500px] bg-gray-100 border-2 border-red-500">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <ambientLight intensity={1} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Test cube - should always be visible */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh position={[-2, 0, 0]}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>

        <Suspense
          fallback={
            // eslint-disable-next-line react/no-unknown-property
            <mesh position={[2, 0, 0]}>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="yellow" />
            </mesh>
          }
        >
          <TestCoin />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}
