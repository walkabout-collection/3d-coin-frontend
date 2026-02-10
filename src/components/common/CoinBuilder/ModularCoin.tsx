"use client";
import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CoinText } from "./CoinText";
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
  front: { previewImage: string | null };
  back: { previewImage: string | null };
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
const parseDimension = (dim: string): number => {
  if (!dim) return 25; // Default 25mm
  const match = dim.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 25;
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
    const BASE_SCALE_MULTIPLIER = 35;

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
    // - Diameter ratio ONLY affects X and Y axes (coin width/depth)
    // - Thickness ratio ONLY affects Z axis (coin height/thickness)
    const diameterRatio = actualDiameter / baseDiameter;
    const thicknessRatio = actualThickness / baseThickness;

    // Apply scaling - DIAMETER affects X/Y, THICKNESS affects Z
    // Coin model is assumed to be oriented with:
    // - X and Y axes = diameter (horizontal plane)
    // - Z axis = thickness (vertical/height)
    let scaleX = BASE_SCALE_MULTIPLIER * diameterRatio; // Diameter only
    let scaleY = BASE_SCALE_MULTIPLIER * diameterRatio; // Diameter only
    let scaleZ = BASE_SCALE_MULTIPLIER * thicknessRatio; // Thickness only

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
    scaleZ = Math.max(scaleZ, minScale * 0.5);

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

    // Reset scale first to avoid cumulative scaling, then apply new scale
    scene.scale.set(1, 1, 1);
    scene.scale.set(scaleX, scaleY, scaleZ);

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
      console.log("🔍 Coin Mesh Names:", meshInfo);
      console.log("🔍 Current Edge Type:", validEdgeType);
      console.log("🔍 Edge Textures State:", {
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
          if (process.env.NODE_ENV === "development") {
            console.log(
              `  🎯 Placeholder mesh "${meshName}" - skipping texture application`,
            );
          }
          return; // Skip this mesh
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
    dimensions,
    diameter,
    thickness,
    materialId,
    validEdgeType,
  ]);

  // Auto-rotate
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Get actual positions of text area meshes from the GLB
  // These meshes are recessed geometry where text should appear
  const [textAreaPositions, setTextAreaPositions] = React.useState<{
    frontTop: [number, number, number] | null;
    frontBottom: [number, number, number] | null;
    backTop: [number, number, number] | null;
    backBottom: [number, number, number] | null;
  }>({
    frontTop: null,
    frontBottom: null,
    backTop: null,
    backBottom: null,
  });

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

  // Track if we've already extracted positions to prevent infinite loops
  const positionsExtractedRef = useRef(false);

  // Extract positions from placeholder meshes in the GLB
  // This runs after the scene is loaded and scaled
  useEffect(() => {
    if (!scene || positionsExtractedRef.current) return;

    const textAreas: {
      frontTop: THREE.Vector3 | null;
      frontBottom: THREE.Vector3 | null;
      backTop: THREE.Vector3 | null;
      backBottom: THREE.Vector3 | null;
    } = {
      frontTop: null,
      frontBottom: null,
      backTop: null,
      backBottom: null,
    };

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

    // Wait a frame to ensure scene is fully loaded and scaled
    const timeoutId = setTimeout(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const meshName = child.name;

          // Get world position AFTER scaling (accounting for all parent transforms including scale)
          const worldPosition = new THREE.Vector3();
          child.getWorldPosition(worldPosition);

          if (meshName === "Front_Top_Text_Area") {
            textAreas.frontTop = worldPosition.clone();
          } else if (meshName === "Front_Bottom_Text_Area") {
            textAreas.frontBottom = worldPosition.clone();
          } else if (meshName === "Back_Top_Text_Area") {
            textAreas.backTop = worldPosition.clone();
          } else if (meshName === "Back_Bottom_Text_Area") {
            textAreas.backBottom = worldPosition.clone();
          } else if (meshName === "Front_Image_Placeholder") {
            imagePlaceholders.front = worldPosition.clone();
            foundPlaceholderMeshes.front = child;
          } else if (meshName === "Back_Image_Placeholder") {
            imagePlaceholders.back = worldPosition.clone();
            foundPlaceholderMeshes.back = child;
          }
        }
      });

      // Update placeholder meshes state
      setPlaceholderMeshes(foundPlaceholderMeshes);

      // Update state with found positions (already scaled)
      setTextAreaPositions({
        frontTop: textAreas.frontTop
          ? [textAreas.frontTop.x, textAreas.frontTop.y, textAreas.frontTop.z]
          : null,
        frontBottom: textAreas.frontBottom
          ? [
              textAreas.frontBottom.x,
              textAreas.frontBottom.y,
              textAreas.frontBottom.z,
            ]
          : null,
        backTop: textAreas.backTop
          ? [textAreas.backTop.x, textAreas.backTop.y, textAreas.backTop.z]
          : null,
        backBottom: textAreas.backBottom
          ? [
              textAreas.backBottom.x,
              textAreas.backBottom.y,
              textAreas.backBottom.z,
            ]
          : null,
      });

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

      // Mark as extracted to prevent re-running
      positionsExtractedRef.current = true;

      if (process.env.NODE_ENV === "development") {
        console.log("📍 Text Area Positions Found (scaled):", {
          frontTop: textAreas.frontTop
            ? `${textAreas.frontTop.x.toFixed(3)}, ${textAreas.frontTop.y.toFixed(3)}, ${textAreas.frontTop.z.toFixed(3)}`
            : "NOT FOUND",
          frontBottom: textAreas.frontBottom
            ? `${textAreas.frontBottom.x.toFixed(3)}, ${textAreas.frontBottom.y.toFixed(3)}, ${textAreas.frontBottom.z.toFixed(3)}`
            : "NOT FOUND",
          backTop: textAreas.backTop
            ? `${textAreas.backTop.x.toFixed(3)}, ${textAreas.backTop.y.toFixed(3)}, ${textAreas.backTop.z.toFixed(3)}`
            : "NOT FOUND",
          backBottom: textAreas.backBottom
            ? `${textAreas.backBottom.x.toFixed(3)}, ${textAreas.backBottom.y.toFixed(3)}, ${textAreas.backBottom.z.toFixed(3)}`
            : "NOT FOUND",
        });
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
      }
    }, 100); // Small delay to ensure scene is scaled

    return () => clearTimeout(timeoutId);
  }, [scene]);

  // Fallback positions if meshes not found (use calculated positions)sudo systemctl restart nginx

  const BASE_SCALE_MULTIPLIER = 35;
  const edgeTextRadius = radius * 0.88;
  const scaledRadius = edgeTextRadius * BASE_SCALE_MULTIPLIER;
  const scaledThickness = thickness * BASE_SCALE_MULTIPLIER;

  const frontTopPos: [number, number, number] = textAreaPositions.frontTop || [
    0,
    scaledRadius,
    scaledThickness / 2,
  ];
  const frontBottomPos: [number, number, number] =
    textAreaPositions.frontBottom || [0, -scaledRadius, scaledThickness / 2];
  const backTopPos: [number, number, number] = textAreaPositions.backTop || [
    0,
    scaledRadius,
    -scaledThickness / 2,
  ];
  const backBottomPos: [number, number, number] =
    textAreaPositions.backBottom || [0, -scaledRadius, -scaledThickness / 2];

  const frontImagePos: [number, number, number] | null =
    imagePlaceholderPositions.front || null;
  const backImagePos: [number, number, number] | null =
    imagePlaceholderPositions.back || null;

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

      {/* Front Text - Use extracted positions from GLB */}
      {textRings && !textRings.front.noText && textAreaPositions.frontTop && (
        <>
          {textRings.front.top && textRings.front.top.trim() && (
            <CoinText
              text={textRings.front.top}
              position={textAreaPositions.frontTop}
              depth={-0.5}
              fontSize={radius * BASE_SCALE_MULTIPLIER * 0.12}
              visible={true}
            />
          )}
          {textRings.front.bottom &&
            textRings.front.bottom.trim() &&
            textAreaPositions.frontBottom && (
              <CoinText
                text={textRings.front.bottom}
                position={textAreaPositions.frontBottom}
                depth={-0.5}
                fontSize={radius * BASE_SCALE_MULTIPLIER * 0.12}
                visible={true}
              />
            )}
        </>
      )}

      {/* Back Text - Use extracted positions from GLB */}
      {textRings && !textRings.back.noText && textAreaPositions.backTop && (
        <>
          {textRings.back.top && textRings.back.top.trim() && (
            <CoinText
              text={textRings.back.top}
              position={textAreaPositions.backTop}
              depth={-0.5}
              fontSize={radius * BASE_SCALE_MULTIPLIER * 0.12}
              visible={true}
            />
          )}
          {textRings.back.bottom &&
            textRings.back.bottom.trim() &&
            textAreaPositions.backBottom && (
              <CoinText
                text={textRings.back.bottom}
                position={textAreaPositions.backBottom}
                depth={-0.5}
                fontSize={radius * BASE_SCALE_MULTIPLIER * 0.12}
                visible={true}
              />
            )}
        </>
      )}

      {/* Front Artwork - Apply texture directly to placeholder mesh */}
      {artwork?.front?.previewImage &&
        artwork.front.previewImage.trim() &&
        placeholderMeshes.front && (
          <CoinArtwork
            imageUrl={artwork.front.previewImage}
            side="front"
            radius={radius}
            position={imagePlaceholderPositions.front}
            reliefType="flat"
            placeholderMesh={placeholderMeshes.front}
          />
        )}

      {/* Back Artwork - Apply texture directly to placeholder mesh */}
      {artwork?.back?.previewImage &&
        artwork.back.previewImage.trim() &&
        placeholderMeshes.back && (
          <CoinArtwork
            imageUrl={artwork.back.previewImage}
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
