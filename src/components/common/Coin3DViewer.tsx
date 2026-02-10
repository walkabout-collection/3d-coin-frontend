"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ModularCoin } from "./CoinBuilder/ModularCoin";
import { DynamicLighting } from "./CoinBuilder/DynamicLighting";
import { ControlsInitializer } from "./CoinBuilder/ControlsInitializer";
import { GLBVerification } from "./CoinBuilder/GLBVerification";

interface Dimensions {
  coinDiameter: string;
  coinThickness: string;
}

interface TextRings {
  front: { top: string; bottom: string; noText: boolean };
  back: { top: string; bottom: string; noText: boolean };
}

interface Artwork {
  front: { previewImage: string | null };
  back: { previewImage: string | null };
}

interface Coin3DViewerProps {
  materialId?: string;
  dimensions?: Dimensions;
  edgeType?: string;
  textRings?: TextRings;
  artwork?: Artwork;
  className?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  rotationSpeed?: number; // Speed of manual rotation (default: 0.5)
  orbitRotateSpeed?: number; // Speed of OrbitControls auto-rotate (default: 0.5)
}

export const Coin3DViewer: React.FC<Coin3DViewerProps> = ({
  materialId = "gold",
  dimensions,
  edgeType = "smooth",
  textRings,
  artwork,
  className = "",
  autoRotate = false,
  enableControls = true,
  rotationSpeed = 0,
  orbitRotateSpeed = 0,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = React.useRef<any>(null);

  // Ensure edgeType has a valid default value (handle empty string from store)
  const validEdgeType =
    edgeType && edgeType.trim() !== "" ? edgeType : "smooth";

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ minHeight: "400px" }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }} // Adjusted for larger coin size - front view
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="bg-transparent"
        onCreated={({ gl, scene: canvasScene, camera }) => {
          gl.setClearColor(0x000000, 0); // Transparent background

          // Set initial camera position to show front side properly
          // Position camera in front of coin (positive Z) with slight elevation
          // This ensures front side is visible by default
          camera.position.set(0, 1.5, 10);
          camera.lookAt(0, 0, 0); // Look at coin center

          console.log("🎨 Canvas created:", {
            children: canvasScene.children.length,
            cameraPosition: camera.position,
            renderer: gl.domElement.width + "x" + gl.domElement.height,
          });
        }}
        onError={(error) => {
          console.error("❌ Canvas error:", error);
        }}
      >
        <Suspense
          fallback={
            // eslint-disable-next-line react/no-unknown-property
            <mesh>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <boxGeometry args={[2, 2, 0.2]} />
              <meshStandardMaterial color="blue" />
            </mesh>
          }
        >
          {/* Studio-style HDRI Environment for optimal texture visualization */}
          <Environment
            preset="studio"
            background={false} // Don't replace background, just use for lighting
            environmentIntensity={1.0} // Full intensity for better texture visibility
          />

          {/* Dynamic Lighting - Adjusts based on viewing angle (front/back) */}
          <DynamicLighting />

          {/* GLB Verification - Logs all mesh names to console */}
          <GLBVerification />

          {/* Modular Coin Model - Updates in real-time */}
          <ModularCoin
            materialId={materialId}
            dimensions={dimensions}
            edgeType={validEdgeType}
            textRings={textRings}
            artwork={artwork}
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
          />

          {/* Controls - Only rotation enabled, zoom/scale disabled */}
          {enableControls && (
            <>
              <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={0.8}
                maxDistance={0.8}
                autoRotate={autoRotate}
                autoRotateSpeed={orbitRotateSpeed}
                target={[0, 0, 0]} // Look at coin center
                makeDefault
              />
              <ControlsInitializer controlsRef={controlsRef} />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Coin3DViewer;
