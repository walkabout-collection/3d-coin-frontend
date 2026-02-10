"use client";
import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Component to verify GLB file contains all required meshes
 * Add this temporarily to your app to check mesh names
 */
export const GLBVerification: React.FC = () => {
  const { scene } = useGLTF("/Coin/Coin.glb");

  useEffect(() => {
    if (!scene) return;

    console.log("=".repeat(60));
    console.log("🔍 GLB VERIFICATION REPORT");
    console.log("=".repeat(60));

    const allMeshes: string[] = [];
    const requiredTextAreas = [
      "Front_Top_Text_Area",
      "Front_Bottom_Text_Area",
      "Back_Top_Text_Area",
      "Back_Bottom_Text_Area",
    ];
    const requiredImagePlaceholders = [
      "Front_Image_Placeholder",
      "Back_Image_Placeholder",
    ];

    const foundTextAreas: string[] = [];
    const foundImagePlaceholders: string[] = [];
    const foundEdgeTypes: string[] = [];
    const foundFaces: string[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name;
        allMeshes.push(meshName);

        // Check for text areas
        if (requiredTextAreas.includes(meshName)) {
          foundTextAreas.push(meshName);
        }

        // Check for image placeholders
        if (requiredImagePlaceholders.includes(meshName)) {
          foundImagePlaceholders.push(meshName);
        }

        // Check for edge types
        const edgeTypes = [
          "Smooth",
          "Rope",
          "oblique",
          "Diamond",
          "Grid",
          "Curve wave",
          "Plate wave",
          "Petal pattern",
        ];
        if (edgeTypes.some((et) => meshName.includes(et))) {
          foundEdgeTypes.push(meshName);
        }

        // Check for faces
        if (meshName.includes("Top Face") || meshName.includes("Bottom Face")) {
          foundFaces.push(meshName);
        }
      }
    });

    console.log("\n📋 ALL MESH NAMES FOUND:");
    console.log(allMeshes.sort());

    console.log("\n✅ VERIFICATION RESULTS:");
    console.log("-".repeat(60));

    // Check text areas
    console.log("\n🔴 TEXT AREA MESHES (Required: 4):");
    requiredTextAreas.forEach((required) => {
      const found = foundTextAreas.includes(required);
      console.log(
        `  ${found ? "✅" : "❌"} ${required} ${found ? "FOUND" : "MISSING"}`,
      );
    });
    console.log(
      `  Status: ${foundTextAreas.length}/4 found ${
        foundTextAreas.length === 4 ? "✅" : "❌"
      }`,
    );

    // Check image placeholders
    console.log("\n🔴 IMAGE PLACEHOLDER MESHES (Required: 2):");
    requiredImagePlaceholders.forEach((required) => {
      const found = foundImagePlaceholders.includes(required);
      console.log(
        `  ${found ? "✅" : "❌"} ${required} ${found ? "FOUND" : "MISSING"}`,
      );
    });
    console.log(
      `  Status: ${foundImagePlaceholders.length}/2 found ${
        foundImagePlaceholders.length === 2 ? "✅" : "❌"
      }`,
    );

    // Check edge types
    console.log("\n🟡 EDGE TYPES (Expected: 8):");
    console.log(`  Found: ${foundEdgeTypes.length} edge meshes`);
    foundEdgeTypes.forEach((et) => console.log(`    - ${et}`));

    // Check faces
    console.log("\n🟡 FACE MESHES (Expected: 2):");
    console.log(`  Found: ${foundFaces.length} face meshes`);
    foundFaces.forEach((face) => console.log(`    - ${face}`));

    // Overall status
    console.log("\n" + "=".repeat(60));
    const allRequiredFound =
      foundTextAreas.length === 4 && foundImagePlaceholders.length === 2;
    console.log(
      `\n📊 OVERALL STATUS: ${
        allRequiredFound ? "✅ ALL REQUIRED MESHES FOUND" : "❌ MISSING MESHES"
      }`,
    );
    console.log("=".repeat(60));

    // Check model scale
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    console.log("\n📏 MODEL DIMENSIONS:");
    console.log(
      `  Size: ${size.x.toFixed(4)} x ${size.y.toFixed(4)} x ${size.z.toFixed(4)}`,
    );
    console.log(
      `  Center: (${center.x.toFixed(4)}, ${center.y.toFixed(4)}, ${center.z.toFixed(4)})`,
    );
    console.log(
      `  Expected center: (0, 0, 0) ${center.length() < 0.001 ? "✅" : "❌"}`,
    );

    // Check RootNode scale
    scene.traverse((child) => {
      if (child.name === "RootNode" || child.name === "Scene") {
        console.log(`\n📐 ${child.name} Scale:`, child.scale);
        if (child.scale.x === 1 && child.scale.y === 1 && child.scale.z === 1) {
          console.log("  ✅ Scale is 1.0 (correct)");
        } else {
          console.log("  ⚠️ Scale is not 1.0 - may need adjustment");
        }
      }
    });
  }, [scene]);

  return null; // This component doesn't render anything
};
