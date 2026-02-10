"use client";
import React, { useMemo } from "react";
import { Text } from "@react-three/drei";

interface CoinTextProps {
  text: string;
  position: [number, number, number];
  depth: number; // Embossing depth (positive = raised, negative = engraved)
  fontSize?: number;
  color?: string;
  visible?: boolean;
}

/**
 * Renders text on the coin with embossing/engraving effect
 */
export const CoinText: React.FC<CoinTextProps> = ({
  text,
  position,
  depth = 0.1,
  fontSize = 0.3,
  color = "#000000",
  visible = true,
}) => {
  if (!text || !visible) return null;

  // Create embossed/engraved text effect
  const textLayers = useMemo(() => {
    const layers: JSX.Element[] = [];

    if (depth > 0) {
      // Embossed (raised) - create shadow layer first
      layers.push(
        <Text
          key="shadow"
          position={[position[0], position[1], position[2] - depth * 0.1]}
          fontSize={fontSize}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {text}
        </Text>,
      );

      // Main embossed text
      layers.push(
        <Text
          key="main"
          position={position}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#ffffff"
        >
          {text}
        </Text>,
      );
    } else if (depth < 0) {
      // Engraved (recessed) - positioned slightly below surface for depth effect
      // Use darker color for engraved appearance
      // Position text at the exact position (depth is already accounted for in position)
      layers.push(
        <Text
          key="engraved"
          position={position}
          fontSize={fontSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          renderOrder={1000}
        >
          {text}
        </Text>,
      );
    } else {
      // Flat text - directly on surface
      layers.push(
        <Text
          key="flat"
          position={position}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#ffffff"
        >
          {text}
        </Text>,
      );
    }

    return layers;
  }, [text, position, depth, fontSize, color]);

  return <>{textLayers}</>;
};
