"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useProgress,
  useGLTF,
} from "@react-three/drei";
import { ModularCoin } from "./CoinBuilder/ModularCoin";
import { DynamicLighting } from "./CoinBuilder/DynamicLighting";
import { ControlsInitializer } from "./CoinBuilder/ControlsInitializer";
import { GLBVerification } from "./CoinBuilder/GLBVerification";
useGLTF.preload("/Coin/Coin.glb");

const CANVAS_BG_COLOR = 0xffffff;

interface Dimensions {
  coinDiameter: string;
  coinThickness: string;
}

interface TextRings {
  front: { top: string; bottom: string; noText: boolean };
  back: { top: string; bottom: string; noText: boolean };
}

interface Artwork {
  front: {
    previewImage: string | null;
    uploadedImage: File | null;
  };
  back: {
    previewImage: string | null;
    uploadedImage: File | null;
  };
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
  rotationSpeed?: number;
  orbitRotateSpeed?: number;
}

const CoinLoadingOverlay: React.FC = () => {
  const { active } = useProgress();
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (active) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(true);
    } else {
      timerRef.current = setTimeout(() => setVisible(false), 400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 pointer-events-none gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--ternary)]/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--ternary)] border-r-[var(--ternary-light)] animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[var(--ternary)] to-[var(--ternary-light)] shadow-inner" />
      </div>
      <p className="text-primary text-sm tracking-[0.2em] uppercase font-semibold">
        Loading Coin
      </p>
    </div>
  );
};

export const Coin3DViewer: React.FC<Coin3DViewerProps> = ({
  materialId = "gold",
  dimensions,
  edgeType = "smooth",
  textRings,
  artwork,
  className = "",
  autoRotate = false,
  enableControls = true,
  rotationSpeed = 0.3,
  orbitRotateSpeed = 1,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = React.useRef<any>(null);

  const validEdgeType =
    edgeType && edgeType.trim() !== "" ? edgeType : "smooth";

  return (
    <div
      className={`w-full h-full relative bg-white ${className}`}
      style={{ minHeight: "400px" }}
    >
      <CoinLoadingOverlay />
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene: canvasScene, camera }) => {
          gl.setClearColor(CANVAS_BG_COLOR, 1);

          camera.position.set(0, 1.5, 10);
          camera.lookAt(0, 0, 0);

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
        <Suspense fallback={null}>
          <Environment
            preset="studio"
            background={false}
            environmentIntensity={1.0}
          />

          <DynamicLighting />

          {process.env.NODE_ENV !== "production" && <GLBVerification />}

          <ModularCoin
            materialId={materialId}
            dimensions={dimensions}
            edgeType={validEdgeType}
            textRings={textRings}
            artwork={artwork}
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
          />

          {enableControls && (
            <>
              <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={false}
                enableRotate={true}
                enableDamping
                dampingFactor={0.05}
                minDistance={0.8}
                maxDistance={0.8}
                autoRotate={false}
                autoRotateSpeed={orbitRotateSpeed}
                target={[0, 0, 0]}
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
