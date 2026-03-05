"use client";
import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CoinTextTexture } from "./CoinTextTexture";
import { CoinArtwork } from "./CoinArtwork";
import { getTexturePath } from "@/src/utils/materialTextures";

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

interface ModularCoinProps {
  materialId: string;
  dimensions?: Dimensions;
  edgeType?: string;
  textRings?: TextRings;
  artwork?: Artwork;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

// Helper to convert mm to Three.js units
const mmToUnits = (mm: number): number => mm / 10; // 1 unit = 10mm

// Helper to parse dimensions
const parseDimension = (dim: string, defaultValue: number = 25): number => {
  if (!dim) return defaultValue;
  const match = dim.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : defaultValue;
};

// Helper to get text color based on material for good contrast
const getTextColorForMaterial = (materialId: string): string => {
  // Map materials to text colors that provide good contrast
  const materialColorMap: Record<string, string> = {
    gold: "#000000", // Black on gold
    silver: "#000000", // Black on silver
    copper: "#000000", // Black on copper
    "black-nickel": "#FFFFFF", // White on black nickel
    "antique-gold": "#000000", // Black on antique gold
    "antique-silver": "#000000", // Black on antique silver
    bronze: "#000000", // Black on bronze
    "antique-bronze": "#000000", // Black on antique bronze
  };
  return materialColorMap[materialId] || "#000000"; // Default to black
};

export const ModularCoin: React.FC<ModularCoinProps> = ({
  materialId,
  dimensions,
  edgeType = "smooth",
  textRings,
  artwork,
  autoRotate = false,
  rotationSpeed = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/Coin/Coin.glb");

  // Ensure edgeType has a valid default value (handle empty string from store)
  const validEdgeType =
    edgeType && edgeType.trim() !== "" ? edgeType : "smooth";

  // Parse dimensions for scaling
  const diameter = useMemo(
    () => mmToUnits(parseDimension(dimensions?.coinDiameter || "25")),
    [dimensions?.coinDiameter],
  );
  const thickness = useMemo(
    () => mmToUnits(parseDimension(dimensions?.coinThickness || "2.5")),
    [dimensions?.coinThickness],
  );
  const radius = diameter / 2;

  // Base scale multiplier for coin visibility (used throughout the component)
  const BASE_SCALE_MULTIPLIER = 30;

  // Load textures for each part (Top Face, Bottom Face, Edge)
  const [topFaceTextures, setTopFaceTextures] = React.useState<{
    map: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
    metalnessMap: THREE.Texture | null;
    heightMap: THREE.Texture | null;
  }>({
    map: null,
    normalMap: null,
    roughnessMap: null,
    metalnessMap: null,
    heightMap: null,
  });

  const [bottomFaceTextures, setBottomFaceTextures] = React.useState<{
    map: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
    metalnessMap: THREE.Texture | null;
    heightMap: THREE.Texture | null;
  }>({
    map: null,
    normalMap: null,
    roughnessMap: null,
    metalnessMap: null,
    heightMap: null,
  });

  const [edgeTextures, setEdgeTextures] = React.useState<{
    map: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
    metalnessMap: THREE.Texture | null;
    heightMap: THREE.Texture | null;
  }>({
    map: null,
    normalMap: null,
    roughnessMap: null,
    metalnessMap: null,
    heightMap: null,
  });

  // Load all textures
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Texture Loading Effect Triggered:", {
        materialId,
        edgeType: validEdgeType,
        timestamp: new Date().toISOString(),
      });
    }

    const loader = new THREE.TextureLoader();

    const loadTexture = (
      path: string,
      textureType: string = "default",
    ): THREE.Texture | null => {
      try {
        const texture = loader.load(
          path,
          (loadedTexture) => {
            // Configure texture properties for optimal PBR rendering
            loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
            loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
            loadedTexture.flipY = false; // GLB/GLTF uses bottom-left origin

            // Set texture filtering for better quality
            loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;

            // Generate mipmaps for better performance and quality
            loadedTexture.generateMipmaps = true;

            // Anisotropic filtering for better texture quality at angles
            loadedTexture.anisotropy = 4;

            // Mark texture as needing update
            loadedTexture.needsUpdate = true;

            // Log successful texture load for edge textures
            if (
              process.env.NODE_ENV === "development" &&
              textureType.includes("Edge")
            ) {
              console.log(
                `✅ Edge texture loaded: ${textureType} from ${path}`,
              );
            }
          },
          undefined,
          (error) => {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                `⚠️ Failed to load texture [${textureType}]: ${path}`,
                error,
              );
            }
          },
        );

        // Set initial properties (will be updated in onLoad callback)
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.flipY = false;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = 4;

        return texture;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `⚠️ Error loading texture [${textureType}]: ${path}`,
            error,
          );
        }
        return null;
      }
    };

    // Load Top Face textures with proper type labels
    const topTextures = {
      map: loadTexture(
        getTexturePath(materialId, "BaseColor", "Top Face"),
        "Top Face - BaseColor",
      ),
      normalMap: loadTexture(
        getTexturePath(materialId, "Normal", "Top Face"),
        "Top Face - Normal",
      ),
      roughnessMap: loadTexture(
        getTexturePath(materialId, "Roughness", "Top Face"),
        "Top Face - Roughness",
      ),
      metalnessMap: loadTexture(
        getTexturePath(materialId, "Metallic", "Top Face"),
        "Top Face - Metallic",
      ),
      heightMap: loadTexture(
        getTexturePath(materialId, "Height", "Top Face"),
        "Top Face - Height",
      ),
    };

    // Load Bottom Face textures with proper type labels
    const bottomTextures = {
      map: loadTexture(
        getTexturePath(materialId, "BaseColor", "Bottom Face"),
        "Bottom Face - BaseColor",
      ),
      normalMap: loadTexture(
        getTexturePath(materialId, "Normal", "Bottom Face"),
        "Bottom Face - Normal",
      ),
      roughnessMap: loadTexture(
        getTexturePath(materialId, "Roughness", "Bottom Face"),
        "Bottom Face - Roughness",
      ),
      metalnessMap: loadTexture(
        getTexturePath(materialId, "Metallic", "Bottom Face"),
        "Bottom Face - Metallic",
      ),
      heightMap: loadTexture(
        getTexturePath(materialId, "Height", "Bottom Face"),
        "Bottom Face - Height",
      ),
    };

    // Load Edge textures (with edge type) with proper type labels
    const edgeBaseColorPath = getTexturePath(
      materialId,
      "BaseColor",
      "Edge",
      validEdgeType,
    );
    const edgeNormalPath = getTexturePath(
      materialId,
      "Normal",
      "Edge",
      validEdgeType,
    );
    const edgeRoughnessPath = getTexturePath(
      materialId,
      "Roughness",
      "Edge",
      validEdgeType,
    );
    const edgeMetallicPath = getTexturePath(
      materialId,
      "Metallic",
      "Edge",
      validEdgeType,
    );
    const edgeHeightPath = getTexturePath(
      materialId,
      "Height",
      "Edge",
      validEdgeType,
    );

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Loading Edge Textures:", {
        edgeType: validEdgeType,
        paths: {
          baseColor: edgeBaseColorPath,
          normal: edgeNormalPath,
          roughness: edgeRoughnessPath,
          metallic: edgeMetallicPath,
          height: edgeHeightPath,
        },
      });
    }

    const edgeTexts = {
      map: loadTexture(
        edgeBaseColorPath,
        `Edge (${validEdgeType}) - BaseColor`,
      ),
      normalMap: loadTexture(
        edgeNormalPath,
        `Edge (${validEdgeType}) - Normal`,
      ),
      roughnessMap: loadTexture(
        edgeRoughnessPath,
        `Edge (${validEdgeType}) - Roughness`,
      ),
      metalnessMap: loadTexture(
        edgeMetallicPath,
        `Edge (${validEdgeType}) - Metallic`,
      ),
      heightMap: loadTexture(
        edgeHeightPath,
        `Edge (${validEdgeType}) - Height`,
      ),
    };

    setTopFaceTextures(topTextures);
    setBottomFaceTextures(bottomTextures);
    setEdgeTextures(edgeTexts);

    // Debug: Log texture loading status
    if (process.env.NODE_ENV === "development") {
      console.log("🎨 Texture Loading Status:", {
        material: materialId,
        edgeType: validEdgeType,
        topFace: {
          baseColor: !!topTextures.map,
          normal: !!topTextures.normalMap,
          roughness: !!topTextures.roughnessMap,
          metallic: !!topTextures.metalnessMap,
          height: !!topTextures.heightMap,
        },
        bottomFace: {
          baseColor: !!bottomTextures.map,
          normal: !!bottomTextures.normalMap,
          roughness: !!bottomTextures.roughnessMap,
          metallic: !!bottomTextures.metalnessMap,
          height: !!bottomTextures.heightMap,
        },
        edge: {
          baseColor: !!edgeTexts.map,
          normal: !!edgeTexts.normalMap,
          roughness: !!edgeTexts.roughnessMap,
          metallic: !!edgeTexts.metalnessMap,
          height: !!edgeTexts.heightMap,
        },
      });
    }

    return () => {
      // Dispose old textures when edgeType or materialId changes
      [
        ...Object.values(topTextures),
        ...Object.values(bottomTextures),
        ...Object.values(edgeTexts),
      ].forEach((t) => {
        if (t) {
          t.dispose();
        }
      });
    };
  }, [materialId, validEdgeType]);

  // Apply textures to named meshes in GLB and scale the model
  useEffect(() => {
    if (!scene) return;

    // ============================================
    // COIN SIZE CONTROL - Base scale multiplier for visibility
    // ============================================
    // BASE_SCALE_MULTIPLIER is defined at component level

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Calculate scale based on actual dimensions
    // Base model is assumed to be 25mm diameter, 2.5mm thickness
    const baseDiameter = 25; // mm
    const baseThickness = 2.5; // mm

    // Get actual dimensions in mm from the store
    const actualDiameter = parseDimension(dimensions?.coinDiameter || "25");
    const actualThickness = parseDimension(dimensions?.coinThickness || "2.5");

    // Calculate scale ratios based on actual vs base dimensions
    // IMPORTANT: These must be completely independent
    // Model orientation: Coin is lying flat (like on a table)
    // - X and Z axes = diameter (coin's circular face - horizontal plane)
    // - Y axis = thickness (coin height - vertical axis)
    const diameterRatio = actualDiameter / baseDiameter;
    const thicknessRatio = actualThickness / baseThickness;

    // Apply scaling using RAF (Relative Axis Factor) pattern
    // CORRECT APPROACH: Diameter controls X & Z, Thickness controls Y
    // - X and Z axes = diameter (coin's circular face) - UNCHANGED by thickness
    // - Y axis = thickness (coin height/vertical) - ONLY axis modified for thickness adjustments
    // This ensures proportional alignment of connected meshes is preserved
    // Pattern: group.scale.set(x, y, z) where:
    //   x = diameter (first parameter - coin face width)
    //   y = thickness (second parameter - coin height/vertical - THIS controls thickness!)
    //   z = diameter (third parameter - coin face depth)
    let scaleX = BASE_SCALE_MULTIPLIER * diameterRatio; // X-axis: diameter only
    let scaleY = BASE_SCALE_MULTIPLIER * thicknessRatio; // Y-axis: thickness only (vertical axis - THIS controls thickness!)
    let scaleZ = BASE_SCALE_MULTIPLIER * diameterRatio; // Z-axis: diameter only

    // Debug: Log model size and scaling to verify orientation
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Coin Scaling Debug:", {
        modelSize: {
          x: size.x.toFixed(2),
          y: size.y.toFixed(2),
          z: size.z.toFixed(2),
        },
        selectedDiameter: `${actualDiameter}mm`,
        selectedThickness: `${actualThickness}mm`,
        diameterRatio: diameterRatio.toFixed(3),
        thicknessRatio: thicknessRatio.toFixed(3),
        finalScale: {
          x: scaleX.toFixed(2),
          y: scaleY.toFixed(2),
          z: scaleZ.toFixed(2),
        },
      });
    }

    // Ensure minimum visibility (prevent coin from being too small)
    const minScale = BASE_SCALE_MULTIPLIER * 0.3; // Minimum 30% of base scale
    scaleX = Math.max(scaleX, minScale);
    scaleY = Math.max(scaleY, minScale);
    scaleZ = Math.max(scaleZ, minScale); // Fixed: Z should use same minimum as X/Y for proper thickness scaling

    // Center the model (only once, don't re-center on every update)
    const isFirstLoad =
      scene.position.x === 0 &&
      scene.position.y === 0 &&
      scene.position.z === 0;
    if (
      isFirstLoad &&
      (Math.abs(center.x) > 0.01 ||
        Math.abs(center.y) > 0.01 ||
        Math.abs(center.z) > 0.01)
    ) {
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
    }
    scene.scale.set(1, 1, 1);
    scene.scale.set(scaleX, scaleY, scaleZ);

    // Force matrix update to ensure thickness changes are immediately visible
    scene.updateMatrixWorld(true);

    // Apply textures to meshes based on their names
    // First pass: Log all mesh names for debugging
    const meshInfo: Array<{
      name: string;
      position: { x: number; y: number; z: number };
    }> = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const pos = new THREE.Vector3();
        child.getWorldPosition(pos);
        meshInfo.push({
          name: child.name,
          position: { x: pos.x, y: pos.y, z: pos.z },
        });
      }
    });

    if (process.env.NODE_ENV === "development" && meshInfo.length > 0) {
      console.log("Coin Mesh Names:", meshInfo);
      console.log("Current Edge Type:", validEdgeType);
      console.log("Edge Textures State:", {
        hasBaseColor: !!edgeTextures.map,
        hasNormal: !!edgeTextures.normalMap,
        hasRoughness: !!edgeTextures.roughnessMap,
        hasMetallic: !!edgeTextures.metalnessMap,
        hasHeight: !!edgeTextures.heightMap,
      });

      // Count potential edge meshes
      const potentialEdgeMeshes = meshInfo.filter((m) => {
        const name = m.name.toLowerCase();
        return (
          name.includes("edge") ||
          name.includes("rim") ||
          name.includes("side") ||
          name.includes("border") ||
          name.includes("cylinder")
        );
      });
      console.log(
        "🔍 Potential Edge Meshes Found:",
        potentialEdgeMeshes.length,
        potentialEdgeMeshes,
      );
    }

    // Apply textures to meshes based on their names
    // First, get bounding box to understand model orientation
    const modelBox = new THREE.Box3().setFromObject(scene);
    const modelSize = modelBox.getSize(new THREE.Vector3());
    const modelCenter = modelBox.getCenter(new THREE.Vector3());

    // Map edge type IDs to GLB mesh names (exact names from the GLB file)
    // Updated: Designer changed naming from _1 to 001 suffix
    const edgeTypeToMeshName: Record<string, string> = {
      smooth: "Smooth001",
      rope: "Rope001",
      oblique: "oblique001",
      diamond: "Diamond001",
      "grid-pattern": "Grid001",
      "curve-wave": "Curve_wave001",
      "petal-pattern": "Petal_pattern001",
      "plate-wave": "Plate_wave001",
    };

    const currentEdgeMeshName =
      edgeTypeToMeshName[validEdgeType] || "Smooth001";

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name;
        const meshNameLower = meshName.toLowerCase();
        let textures: typeof topFaceTextures;
        let partName = "unknown";
        let shouldBeVisible = true;

        // Get mesh local bounding box and position
        const meshBox = new THREE.Box3().setFromObject(child);
        const meshCenter = meshBox.getCenter(new THREE.Vector3());
        const meshSize = meshBox.getSize(new THREE.Vector3());

        // Calculate relative position (normalized to model bounds)
        const relativeZ = (meshCenter.z - modelCenter.z) / (modelSize.z || 1);
        const isFlatFace =
          meshSize.z < meshSize.x * 0.1 && meshSize.z < meshSize.y * 0.1; // Thin/flat mesh

        // Skip texture application for placeholder meshes (text/images will be rendered programmatically)
        const isPlaceholderMesh =
          meshName === "Front_Top_Text_Area" ||
          meshName === "Front_Bottom_Text_Area" ||
          meshName === "Back_Top_Text_Area" ||
          meshName === "Back_Bottom_Text_Area" ||
          meshName === "Front_Image_Placeholder" ||
          meshName === "Back_Image_Placeholder";

        if (isPlaceholderMesh) {
          // Don't apply textures to placeholder meshes - they're just geometry
          // Text/images will be rendered/mapped programmatically into these areas
          // Text area meshes will get textures applied by CoinTextTexture component
          // Image placeholder meshes will get textures applied by CoinArtwork component

          child.visible = true; // Ensure mesh is visible

          if (process.env.NODE_ENV === "development") {
            const isTextArea =
              meshName === "Front_Top_Text_Area" ||
              meshName === "Front_Bottom_Text_Area" ||
              meshName === "Back_Top_Text_Area" ||
              meshName === "Back_Bottom_Text_Area";
            console.log(
              `  🎯 Placeholder mesh "${meshName}" - ${isTextArea ? "ready for text texture" : "ready for image texture"}`,
            );
          }
          return; // Skip texture application (text/images will be applied by CoinTextTexture/CoinArtwork)
        }

        // Match meshes by exact GLB names (updated: designer changed _1 to 001 suffix)
        if (meshName === "Top_Face001") {
          textures = topFaceTextures;
          partName = "Top Face";
        } else if (meshName === "Bottom_Face001") {
          textures = bottomFaceTextures;
          partName = "Bottom Face";
        } else if (meshName === currentEdgeMeshName) {
          // This is the selected edge type mesh - show it and apply edge textures
          textures = edgeTextures;
          partName = `Edge (${validEdgeType})`;
          shouldBeVisible = true;
        } else if (Object.values(edgeTypeToMeshName).includes(meshName)) {
          // This is an edge mesh but not the selected one - hide it
          textures = edgeTextures; // Still assign textures, but mesh will be hidden
          partName = `Edge (hidden: ${meshName})`;
          shouldBeVisible = false;
        } else {
          // Fallback: use generic name matching for any other meshes
          const isBack =
            meshNameLower.includes("bottom") ||
            meshNameLower.includes("back") ||
            meshNameLower.includes("rear") ||
            meshNameLower.includes("reverse");

          const isFront =
            meshNameLower.includes("top") ||
            meshNameLower.includes("front") ||
            meshNameLower.includes("obverse");

          if (isBack) {
            textures = bottomFaceTextures;
            partName = "Bottom Face (fallback)";
          } else if (isFront) {
            textures = topFaceTextures;
            partName = "Top Face (fallback)";
          } else if (isFlatFace) {
            // For flat faces, use Z position to determine front/back
            if (relativeZ < -0.3) {
              textures = bottomFaceTextures;
              partName = "Bottom Face (detected: back position)";
            } else if (relativeZ > 0.3) {
              textures = topFaceTextures;
              partName = "Top Face (detected: front position)";
            } else {
              textures = edgeTextures;
              partName = "Edge (detected: middle position)";
            }
          } else {
            // Unknown mesh - default to edge
            textures = edgeTextures;
            partName = "Edge (unknown mesh)";
          }
        }

        if (process.env.NODE_ENV === "development") {
          const isEdgeMesh = partName.includes("Edge");
          if (isEdgeMesh) {
            console.log(
              `  🔄 Edge Mesh: "${child.name || "(unnamed)"}" → ${partName} (visible: ${shouldBeVisible})`,
              {
                meshName: child.name,
                currentEdgeMeshName,
                isSelectedEdge: meshName === currentEdgeMeshName,
                isFlatFace: isFlatFace,
                relativeZ: relativeZ.toFixed(3),
                meshSize: {
                  x: meshSize.x.toFixed(2),
                  y: meshSize.y.toFixed(2),
                  z: meshSize.z.toFixed(2),
                },
              },
            );
          } else {
            console.log(
              `  📍 Mesh: "${child.name || "(unnamed)"}" → ${partName} (visible: ${shouldBeVisible})`,
            );
          }
        }

        // Handle both single material and material arrays
        // CRITICAL: For edge meshes, clone materials FIRST to avoid shared state
        let materials: THREE.Material[];
        if (partName.includes("Edge")) {
          // For edge meshes, always clone materials to ensure independent instances
          const originalMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials = originalMaterials.map((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              const cloned = mat.clone();
              // Immediately set DoubleSide on cloned material
              cloned.side = THREE.DoubleSide;
              return cloned;
            }
            return mat;
          });

          // Update mesh material reference immediately
          if (materials.length === 1) {
            child.material = materials[0];
          } else {
            child.material = materials;
          }

          if (process.env.NODE_ENV === "development") {
            console.log(
              `  🔄 Cloned ${materials.length} material(s) for edge mesh: "${child.name}"`,
            );
          }
        } else {
          materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
        }

        if (materials.length === 0) return; // Skip if no materials

        // CRITICAL: For edge meshes, ensure geometry normals are correct for double-sided rendering
        // Recalculate normals to ensure proper rendering from all angles
        if (
          partName.includes("Edge") &&
          child.geometry instanceof THREE.BufferGeometry
        ) {
          child.geometry.computeVertexNormals();

          if (process.env.NODE_ENV === "development") {
            console.log(
              `  🔧 Recalculated normals for edge mesh: "${child.name}"`,
            );
          }
        }

        // Ensure we have textures loaded before applying
        const hasTextures = !!(
          textures.map ||
          textures.normalMap ||
          textures.roughnessMap ||
          textures.metalnessMap
        );
        if (!hasTextures) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `⚠️ No textures loaded for ${partName} (mesh: "${child.name}")`,
            );
          }
          // Still apply material properties even if textures aren't loaded yet
        } else {
          if (process.env.NODE_ENV === "development") {
            console.log(
              `✅ Applying ${partName} textures to mesh: "${child.name}" (${materials.length} material(s))`,
            );
          }
        }

        // Apply textures and material properties to ALL materials
        materials.forEach((mat, matIndex) => {
          let material = mat as THREE.MeshStandardMaterial;
          if (!material) return; // Skip if material is null

          // For non-edge meshes, set single-sided
          if (!partName.includes("Edge")) {
            material.side = THREE.FrontSide;
          }
          // Note: Edge meshes already have materials cloned and DoubleSide set above

          // Apply all PBR texture maps (as specified by designer)
          // BaseColor/Albedo map
          if (textures.map) {
            material.map = textures.map;
            material.map.flipY = false; // Ensure correct orientation
          } else {
            material.map = null; // Clear if not available
          }

          // Normal map for surface detail
          if (textures.normalMap) {
            material.normalMap = textures.normalMap;
            material.normalMap.flipY = false;
            material.normalScale = new THREE.Vector2(1, 1); // Full normal strength
          } else {
            material.normalMap = null; // Clear if not available
          }

          // Roughness map for surface shininess
          if (textures.roughnessMap) {
            material.roughnessMap = textures.roughnessMap;
            material.roughnessMap.flipY = false;
            // Use texture for roughness, but allow override if needed
            material.roughness = 1.0; // Will be modulated by roughness map
          } else {
            material.roughnessMap = null; // Clear if not available
            material.roughness = 0.5; // Fallback if no map
          }

          // Metallic/Metalness map
          if (textures.metalnessMap) {
            material.metalnessMap = textures.metalnessMap;
            material.metalnessMap.flipY = false;
            // Use texture for metalness, but allow override if needed
            material.metalness = 1.0; // Will be modulated by metalness map
          } else {
            material.metalnessMap = null; // Clear if not available
            material.metalness = 0.8; // Fallback if no map
          }

          // Height/Displacement map for depth
          if (textures.heightMap) {
            material.displacementMap = textures.heightMap;
            material.displacementMap.flipY = false;
            material.displacementScale = 0.15; // Increased for better visibility
            material.displacementBias = -0.075; // Adjusted bias
          } else {
            material.displacementMap = null; // Clear if not available
          }

          // Enable proper PBR rendering
          material.envMapIntensity = 1.0; // Full environment map intensity for reflections
          material.flatShading = false; // Smooth shading for better texture visibility

          // CRITICAL: Re-assert double-sided for edge meshes AFTER all updates
          // This ensures it's not overridden by any other material property changes
          if (partName.includes("Edge")) {
            material.side = THREE.DoubleSide;
          }

          // Ensure material uses all maps properly
          material.needsUpdate = true;

          // Force Three.js to update the material
          if (textures.map) {
            textures.map.needsUpdate = true;
          }
          if (textures.normalMap) {
            textures.normalMap.needsUpdate = true;
          }
          if (textures.roughnessMap) {
            textures.roughnessMap.needsUpdate = true;
          }
          if (textures.metalnessMap) {
            textures.metalnessMap.needsUpdate = true;
          }
          if (textures.heightMap) {
            textures.heightMap.needsUpdate = true;
          }

          // Force material update to ensure changes are applied
          if (
            process.env.NODE_ENV === "development" &&
            partName.includes("Edge")
          ) {
            console.log(
              `🔄 Updated ${partName} material[${matIndex}] for edgeType: ${validEdgeType}`,
              {
                meshName: child.name,
                isDoubleSided: material.side === THREE.DoubleSide,
                materialSide: material.side,
                materialSideValue: material.side,
                hasBaseColor: !!textures.map,
                hasNormal: !!textures.normalMap,
                hasRoughness: !!textures.roughnessMap,
                hasMetallic: !!textures.metalnessMap,
                hasHeight: !!textures.heightMap,
                texturePaths: {
                  baseColor: textures.map ? "loaded" : "missing",
                  normal: textures.normalMap ? "loaded" : "missing",
                  roughness: textures.roughnessMap ? "loaded" : "missing",
                  metallic: textures.metalnessMap ? "loaded" : "missing",
                  height: textures.heightMap ? "loaded" : "missing",
                },
              },
            );
          }
        }); // End of materials.forEach

        // Update the mesh's material reference if we modified materials
        if (Array.isArray(child.material) && materials.length > 0) {
          child.material = materials;
        } else if (materials.length > 0) {
          child.material = materials[0];
        }

        // CRITICAL: Final verification - ensure edge meshes have DoubleSide
        // Check again after all updates to make absolutely sure
        if (partName.includes("Edge") && child.material) {
          const finalMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          finalMaterials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.side = THREE.DoubleSide;
              mat.needsUpdate = true;

              if (process.env.NODE_ENV === "development") {
                console.log(
                  `  ✅ Final verification: Set DoubleSide for edge mesh "${child.name}" - side: ${mat.side}`,
                );
              }
            }
          });
        }

        // Set mesh visibility based on whether it should be shown
        child.visible = shouldBeVisible;
      }
    });
  }, [
    scene,
    topFaceTextures,
    bottomFaceTextures,
    edgeTextures,
    dimensions?.coinDiameter,
    dimensions?.coinThickness,
    materialId,
    validEdgeType,
  ]);

  // Auto-rotate
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Calculate text area positions using designer-provided coordinates
  // Designer-provided coordinates (in mm):
  // Front_Top_Text_Area: X: -0.000001 mm, Y: -6.5706 mm, Z: 0.31801 mm
  // Front_Bottom_Text_Area: X: 0.000001 mm, Y: -6.5706 mm, Z: 0.31801 mm
  // Back_Top_Text_Area: X: -0 mm, Y: -6.573 mm, Z: -0.23215 mm
  // Back_Bottom_Text_Area: X: 0 mm, Y: 6.573 mm, Z: -0.23215 mm
  // Convert mm to units and scale with actual coin dimensions
  const textAreaPositions = React.useMemo(() => {
    // Get actual dimensions to calculate scaling ratios
    const actualDiameter = parseDimension(dimensions?.coinDiameter || "25", 25);
    const actualThickness = parseDimension(
      dimensions?.coinThickness || "2.5",
      2.5,
    );
    const baseDiameter = 25; // mm
    const baseThickness = 2.5; // mm

    const diameterRatio = actualDiameter / baseDiameter;
    const thicknessRatio = actualThickness / baseThickness;

    // X and Y positions scale with diameter, Z position scales with thickness
    const frontTopX =
      mmToUnits(-0.000001) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const frontTopY =
      mmToUnits(-6.5706) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const frontTopZ =
      mmToUnits(0.31801) * BASE_SCALE_MULTIPLIER * thicknessRatio;

    const frontBottomX =
      mmToUnits(0.000001) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const frontBottomY =
      mmToUnits(-6.5706) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const frontBottomZ =
      mmToUnits(0.31801) * BASE_SCALE_MULTIPLIER * thicknessRatio;

    const backTopX = mmToUnits(0) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const backTopY = mmToUnits(-6.573) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const backTopZ =
      mmToUnits(-0.23215) * BASE_SCALE_MULTIPLIER * thicknessRatio;

    const backBottomX = mmToUnits(0) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const backBottomY =
      mmToUnits(6.573) * BASE_SCALE_MULTIPLIER * diameterRatio;
    const backBottomZ =
      mmToUnits(-0.23215) * BASE_SCALE_MULTIPLIER * thicknessRatio;

    return {
      frontTop: [frontTopX, frontTopY, frontTopZ] as [number, number, number],
      frontBottom: [frontBottomX, frontBottomY, frontBottomZ] as [
        number,
        number,
        number,
      ],
      backTop: [backTopX, backTopY, backTopZ] as [number, number, number],
      backBottom: [backBottomX, backBottomY, backBottomZ] as [
        number,
        number,
        number,
      ],
    };
  }, [dimensions?.coinDiameter, dimensions?.coinThickness]);

  // Get actual positions of image placeholder meshes from the GLB
  const [imagePlaceholderPositions, setImagePlaceholderPositions] =
    React.useState<{
      front: [number, number, number] | null;
      back: [number, number, number] | null;
    }>({
      front: null,
      back: null,
    });

  // Store references to placeholder meshes for direct texture application
  const [placeholderMeshes, setPlaceholderMeshes] = React.useState<{
    front: THREE.Mesh | null;
    back: THREE.Mesh | null;
  }>({
    front: null,
    back: null,
  });

  // Store references to text area meshes for direct texture application
  const [textAreaMeshes, setTextAreaMeshes] = React.useState<{
    frontTop: THREE.Mesh | null;
    frontBottom: THREE.Mesh | null;
    backTop: THREE.Mesh | null;
    backBottom: THREE.Mesh | null;
  }>({
    frontTop: null,
    frontBottom: null,
    backTop: null,
    backBottom: null,
  });

  // Create object URLs from uploaded images and clean them up
  const frontImageUrl = useMemo(() => {
    if (artwork?.front?.previewImage) {
      return artwork.front.previewImage;
    }
    if (artwork?.front?.uploadedImage) {
      return URL.createObjectURL(artwork.front.uploadedImage);
    }
    return null;
  }, [artwork?.front?.previewImage, artwork?.front?.uploadedImage]);

  const backImageUrl = useMemo(() => {
    if (artwork?.back?.previewImage) {
      return artwork.back.previewImage;
    }
    if (artwork?.back?.uploadedImage) {
      return URL.createObjectURL(artwork.back.uploadedImage);
    }
    return null;
  }, [artwork?.back?.previewImage, artwork?.back?.uploadedImage]);

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      if (frontImageUrl && frontImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(frontImageUrl);
      }
      if (backImageUrl && backImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(backImageUrl);
      }
    };
  }, [frontImageUrl, backImageUrl]);

  // Extract positions from placeholder meshes in the GLB
  // This runs after the scene is loaded and scaled, and re-runs when dimensions change
  useEffect(() => {
    if (!scene) return;

    const imagePlaceholders: {
      front: THREE.Vector3 | null;
      back: THREE.Vector3 | null;
    } = {
      front: null,
      back: null,
    };

    const foundPlaceholderMeshes: {
      front: THREE.Mesh | null;
      back: THREE.Mesh | null;
    } = {
      front: null,
      back: null,
    };

    const foundTextAreaMeshes: {
      frontTop: THREE.Mesh | null;
      frontBottom: THREE.Mesh | null;
      backTop: THREE.Mesh | null;
      backBottom: THREE.Mesh | null;
    } = {
      frontTop: null,
      frontBottom: null,
      backTop: null,
      backBottom: null,
    };

    // Wait a frame to ensure scene is fully loaded and scaled
    const timeoutId = setTimeout(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const meshName = child.name;

          if (meshName === "Front_Image_Placeholder") {
            // Get world position AFTER scaling (accounting for all parent transforms including scale)
            const worldPosition = new THREE.Vector3();
            child.getWorldPosition(worldPosition);
            imagePlaceholders.front = worldPosition.clone();
            foundPlaceholderMeshes.front = child;
          } else if (meshName === "Back_Image_Placeholder") {
            // Get world position AFTER scaling (accounting for all parent transforms including scale)
            const worldPosition = new THREE.Vector3();
            child.getWorldPosition(worldPosition);
            imagePlaceholders.back = worldPosition.clone();
            foundPlaceholderMeshes.back = child;
          } else if (meshName === "Front_Top_Text_Area") {
            foundTextAreaMeshes.frontTop = child;
          } else if (meshName === "Front_Bottom_Text_Area") {
            foundTextAreaMeshes.frontBottom = child;
          } else if (meshName === "Back_Top_Text_Area") {
            foundTextAreaMeshes.backTop = child;
          } else if (meshName === "Back_Bottom_Text_Area") {
            foundTextAreaMeshes.backBottom = child;
          }
        }
      });

      // Update placeholder meshes state
      setPlaceholderMeshes(foundPlaceholderMeshes);
      setTextAreaMeshes(foundTextAreaMeshes);

      // Text area positions are now calculated using designer-provided coordinates in useMemo above
      // No need to set them here as they're computed directly

      setImagePlaceholderPositions({
        front: imagePlaceholders.front
          ? [
              imagePlaceholders.front.x,
              imagePlaceholders.front.y,
              imagePlaceholders.front.z,
            ]
          : null,
        back: imagePlaceholders.back
          ? [
              imagePlaceholders.back.x,
              imagePlaceholders.back.y,
              imagePlaceholders.back.z,
            ]
          : null,
      });

      if (process.env.NODE_ENV === "development") {
        console.log(
          "📍 Text Area Positions (Designer Coordinates - converted and scaled):",
          {
            frontTop: `${textAreaPositions.frontTop[0].toFixed(3)}, ${textAreaPositions.frontTop[1].toFixed(3)}, ${textAreaPositions.frontTop[2].toFixed(3)}`,
            frontBottom: `${textAreaPositions.frontBottom[0].toFixed(3)}, ${textAreaPositions.frontBottom[1].toFixed(3)}, ${textAreaPositions.frontBottom[2].toFixed(3)}`,
            backTop: `${textAreaPositions.backTop[0].toFixed(3)}, ${textAreaPositions.backTop[1].toFixed(3)}, ${textAreaPositions.backTop[2].toFixed(3)}`,
            backBottom: `${textAreaPositions.backBottom[0].toFixed(3)}, ${textAreaPositions.backBottom[1].toFixed(3)}, ${textAreaPositions.backBottom[2].toFixed(3)}`,
          },
        );
        console.log("📍 Image Placeholder Positions Found (scaled):", {
          front: imagePlaceholders.front
            ? `${imagePlaceholders.front.x.toFixed(3)}, ${imagePlaceholders.front.y.toFixed(3)}, ${imagePlaceholders.front.z.toFixed(3)}`
            : "NOT FOUND",
          back: imagePlaceholders.back
            ? `${imagePlaceholders.back.x.toFixed(3)}, ${imagePlaceholders.back.y.toFixed(3)}, ${imagePlaceholders.back.z.toFixed(3)}`
            : "NOT FOUND",
        });
        console.log("📍 Placeholder Meshes Found:", {
          front: foundPlaceholderMeshes.front
            ? `✅ ${foundPlaceholderMeshes.front.name}`
            : "❌ NOT FOUND",
          back: foundPlaceholderMeshes.back
            ? `✅ ${foundPlaceholderMeshes.back.name}`
            : "❌ NOT FOUND",
        });
        console.log("📍 Text Area Meshes Found:", {
          frontTop: foundTextAreaMeshes.frontTop
            ? `✅ ${foundTextAreaMeshes.frontTop.name}`
            : "❌ NOT FOUND",
          frontBottom: foundTextAreaMeshes.frontBottom
            ? `✅ ${foundTextAreaMeshes.frontBottom.name}`
            : "❌ NOT FOUND",
          backTop: foundTextAreaMeshes.backTop
            ? `✅ ${foundTextAreaMeshes.backTop.name}`
            : "❌ NOT FOUND",
          backBottom: foundTextAreaMeshes.backBottom
            ? `✅ ${foundTextAreaMeshes.backBottom.name}`
            : "❌ NOT FOUND",
        });
      }
    }, 100); // Small delay to ensure scene is scaled

    return () => clearTimeout(timeoutId);
  }, [scene, dimensions?.coinDiameter, dimensions?.coinThickness]); // Re-run when dimensions change

  // Text area positions are now set using designer-provided coordinates
  // No fallback needed as we use exact coordinates from the 3D designer

  // Debug logging for text and artwork data (only log when data actually changes)
  const prevTextRingsRef = useRef<string>("");
  const prevArtworkRef = useRef<string>("");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const textRingsKey = JSON.stringify(textRings);
      const artworkKey = JSON.stringify(artwork);

      // Only log if data actually changed
      if (textRingsKey !== prevTextRingsRef.current) {
        prevTextRingsRef.current = textRingsKey;
        console.log("📝 Text Rings Data:", {
          front: {
            top: textRings?.front.top || "empty",
            bottom: textRings?.front.bottom || "empty",
            noText: textRings?.front.noText || false,
          },
          back: {
            top: textRings?.back.top || "empty",
            bottom: textRings?.back.bottom || "empty",
            noText: textRings?.back.noText || false,
          },
        });
      }

      if (artworkKey !== prevArtworkRef.current) {
        prevArtworkRef.current = artworkKey;
        console.log("🖼️ Artwork Data:", {
          front: {
            hasPreviewImage: !!artwork?.front?.previewImage,
            previewImageType:
              artwork?.front?.previewImage?.substring(0, 30) || "none",
          },
          back: {
            hasPreviewImage: !!artwork?.back?.previewImage,
            previewImageType:
              artwork?.back?.previewImage?.substring(0, 30) || "none",
          },
        });
      }
    }
  }, [textRings, artwork]);

  if (!scene) {
    return (
      // eslint-disable-next-line react/no-unknown-property
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshStandardMaterial color="orange" metalness={0.8} roughness={0.5} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {/* GLB Model with applied textures */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <primitive object={scene} />

      {/* Front Text - Apply as texture to text area meshes */}
      {textRings && !textRings.front.noText && (
        <>
          {textRings.front.top &&
            textRings.front.top.trim() &&
            textAreaMeshes.frontTop && (
              <CoinTextTexture
                text={textRings.front.top}
                side="front"
                position="top"
                color={getTextColorForMaterial(materialId)}
                fontSize={
                  72 *
                  (parseDimension(dimensions?.coinDiameter || "25", 25) / 25)
                }
                placeholderMesh={textAreaMeshes.frontTop}
                materialId={materialId}
              />
            )}
          {textRings.front.bottom &&
            textRings.front.bottom.trim() &&
            textAreaMeshes.frontBottom && (
              <CoinTextTexture
                text={textRings.front.bottom}
                side="front"
                position="bottom"
                color={getTextColorForMaterial(materialId)}
                fontSize={
                  72 *
                  (parseDimension(dimensions?.coinDiameter || "25", 25) / 25)
                }
                placeholderMesh={textAreaMeshes.frontBottom}
                materialId={materialId}
              />
            )}
        </>
      )}

      {/* Back Text - Apply as texture to text area meshes */}
      {textRings && !textRings.back.noText && (
        <>
          {textRings.back.top &&
            textRings.back.top.trim() &&
            textAreaMeshes.backTop && (
              <CoinTextTexture
                text={textRings.back.top}
                side="back"
                position="top"
                color={getTextColorForMaterial(materialId)}
                fontSize={
                  72 *
                  (parseDimension(dimensions?.coinDiameter || "25", 25) / 25)
                }
                placeholderMesh={textAreaMeshes.backTop}
                materialId={materialId}
              />
            )}
          {textRings.back.bottom &&
            textRings.back.bottom.trim() &&
            textAreaMeshes.backBottom && (
              <CoinTextTexture
                text={textRings.back.bottom}
                side="back"
                position="bottom"
                color={getTextColorForMaterial(materialId)}
                fontSize={
                  72 *
                  (parseDimension(dimensions?.coinDiameter || "25", 25) / 25)
                }
                placeholderMesh={textAreaMeshes.backBottom}
                materialId={materialId}
              />
            )}
        </>
      )}

      {/* Front Artwork - Apply texture directly to placeholder mesh */}
      {/* Use previewImage if available, otherwise use uploadedImage */}
      {frontImageUrl && frontImageUrl.trim() && placeholderMeshes.front && (
        <CoinArtwork
          imageUrl={frontImageUrl}
          side="front"
          radius={radius}
          position={imagePlaceholderPositions.front}
          reliefType="flat"
          placeholderMesh={placeholderMeshes.front}
        />
      )}

      {/* Back Artwork - Apply texture directly to placeholder mesh */}
      {/* Use previewImage if available, otherwise use uploadedImage */}
      {backImageUrl && backImageUrl.trim() && placeholderMeshes.back && (
        <CoinArtwork
          imageUrl={backImageUrl}
          side="back"
          radius={radius}
          position={imagePlaceholderPositions.back}
          reliefType="flat"
          placeholderMesh={placeholderMeshes.back}
        />
      )}
    </group>
  );
};
