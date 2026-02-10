/**
 * Maps material IDs from the store to texture folder names
 */
export const getMaterialTexturePath = (materialId: string): string => {
  const materialMap: Record<string, string> = {
    gold: "Gold",
    silver: "Silver",
    copper: "Copper",
    "black-nickel": "Black Nickel",
    "antique-gold": "Antique Gold",
    "antique-silver": "Antique Silver",
    bronze: "Bronze",
    "antique-bronze": "Antique Bronze",
  };

  return materialMap[materialId] || "Gold"; // Default to Gold if not found
};

/**
 * Maps edge type IDs to texture file names
 * Note: Texture files use exact names like "Smooth", "Rope", "oblique", "Diamond", "Grid", "Curve wave"
 */
export const getEdgeTypeTextureName = (edgeType: string): string => {
  const edgeMap: Record<string, string> = {
    smooth: "Smooth",
    rope: "Rope",
    oblique: "oblique", // Note: lowercase in texture files
    diamond: "Diamond",
    "grid-pattern": "Grid",
    "curve-wave": "Curve wave",
    // Additional edge types that exist in textures but may not be in store yet
    "petal-pattern": "Petal pattern",
    "plate-wave": "Plate wave",
  };

  return edgeMap[edgeType] || "Smooth";
};

/**
 * Gets the full path to a texture file for a given material and part
 * New structure: /Coin/{Material}/{Coin_{Part}_{TextureType}.png}
 */
export const getTexturePath = (
  materialId: string,
  textureType: "BaseColor" | "Height" | "Metallic" | "Normal" | "Roughness",
  part: "Top Face" | "Bottom Face" | "Edge" = "Top Face",
  edgeType?: string,
): string => {
  const materialFolder = getMaterialTexturePath(materialId);

  // Determine texture file name based on part
  let textureFileName: string;

  if (part === "Edge" && edgeType) {
    const edgeName = getEdgeTypeTextureName(edgeType);
    textureFileName = `Coin_${edgeName}_${textureType}.png`;
  } else if (part === "Top Face") {
    textureFileName = `Coin_Top Face_${textureType}.png`;
  } else if (part === "Bottom Face") {
    textureFileName = `Coin_Bottom Face_${textureType}.png`;
  } else {
    // Fallback
    textureFileName = `Coin_Top Face_${textureType}.png`;
  }

  // New structure: textures are directly in material folders
  return `/Coin/${materialFolder}/${textureFileName}`;
};
