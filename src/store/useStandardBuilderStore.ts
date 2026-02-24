import { create } from "zustand";

interface Dimensions {
  coinDiameter: string;
  coinThickness: string;
}

interface TextRings {
  front: { top: string; bottom: string; noText: boolean };
  back: { top: string; bottom: string; noText: boolean };
}

interface ArtworkSide {
  prompt: string;
  attachedImage: File | null;
  uploadedImage: File | null;
  previewImage: string | null;
}

interface Artwork {
  front: ArtworkSide;
  back: ArtworkSide;
}

interface Packaging {
  preferences: string;
  backText: string;
}
interface StandardBuilderState {
  dimensions: Dimensions;
  material: string;
  edgeType: string;
  textRings: TextRings;
  artwork: Artwork;
  packaging: Packaging;
  currentDraftId: string | null; // Track current draft ID

  setDimensions: (data: Dimensions) => void;
  setMaterial: (material: string) => void;
  setEdgeType: (edgeType: string) => void;
  setTextRings: (rings: TextRings) => void;
  setArtwork: (artwork: Artwork) => void;
  updateArtworkSide: (
    side: "front" | "back",
    data: Partial<ArtworkSide>,
  ) => void;
  setPackaging: (data: Packaging) => void;
  setCurrentDraftId: (draftId: string | null) => void;
  getDesignDataForDraft: () => {
    dimensions?: { coinDiameter?: string; coinThickness?: string };
    material?: string;
    edgeType?: string;
    artwork?: {
      front?: { prompt?: string; previewImage?: string | null };
      back?: { prompt?: string; previewImage?: string | null };
    };
    packaging?: { preferences?: string; backText?: string };
    textRings?: {
      front?: { top?: string; bottom?: string; noText?: boolean };
      back?: { top?: string; bottom?: string; noText?: boolean };
    };
  };
  loadDraftData: (draftData: {
    coinShape?: string;
    materialFinish?: string;
    frontDescription?: string;
    frontImage?: string;
    frontText?: string;
    backDescription?: string;
    backImage?: string;
    backText?: string;
    generatorPrompt?: string;
    generatorImage?: string;
  }) => void;

  reset: () => void;
}

export const useStandardBuilderStore = create<StandardBuilderState>(
  (set, get) => ({
    dimensions: { coinDiameter: "", coinThickness: "" },
    material: "",
    edgeType: "",
    textRings: {
      front: { top: "YOUR TEXT HERE", bottom: "CUSTOM TEXT", noText: false },
      back: { top: "YOUR TEXT HERE", bottom: "CUSTOM TEXT", noText: false },
    },
    artwork: {
      front: {
        prompt: "",
        attachedImage: null,
        uploadedImage: null,
        // Default placeholder image - simple gray square
        previewImage:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EFront Image%3C/text%3E%3C/svg%3E",
      },
      back: {
        prompt: "",
        attachedImage: null,
        uploadedImage: null,
        // Default placeholder image - simple gray square
        previewImage:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EBack Image%3C/text%3E%3C/svg%3E",
      },
    },
    packaging: {
      preferences: "",
      backText: "",
    },
    currentDraftId: null,

    setDimensions: (data) =>
      set((state) => ({ dimensions: { ...state.dimensions, ...data } })),
    setMaterial: (material) => set({ material }),
    setEdgeType: (edgeType) => set({ edgeType }),
    setTextRings: (rings) => set({ textRings: rings }),
    setArtwork: (artwork) => set({ artwork }),
    updateArtworkSide: (side, data) =>
      set((state) => ({
        artwork: {
          ...state.artwork,
          [side]: { ...state.artwork[side], ...data },
        },
      })),
    setPackaging: (data) => set({ packaging: { ...data } }),
    setCurrentDraftId: (draftId) => set({ currentDraftId: draftId }),
    getDesignDataForDraft: () => {
      const state = get();
      // Transform nested structure to flat API structure
      return {
        name: `Standard Builder Draft - ${new Date().toLocaleDateString()}`,
        builderType: "Standard Builder" as const,
        coinShape: state.dimensions.coinDiameter
          ? `Diameter: ${state.dimensions.coinDiameter}${state.dimensions.coinThickness ? `, Thickness: ${state.dimensions.coinThickness}` : ""}`
          : undefined,
        materialFinish: state.material || undefined,
        frontDescription: state.artwork.front.prompt || undefined,
        frontImage: state.artwork.front.previewImage || undefined,
        frontText:
          state.textRings.front.top ||
          state.textRings.front.bottom ||
          undefined,
        backDescription: state.artwork.back.prompt || undefined,
        backImage: state.artwork.back.previewImage || undefined,
        backText:
          state.textRings.back.top || state.textRings.back.bottom || undefined,
        generatorPrompt:
          state.artwork.front.prompt || state.artwork.back.prompt || undefined,
        generatorImage:
          state.artwork.front.previewImage ||
          state.artwork.back.previewImage ||
          undefined,
      };
    },
    loadDraftData: (draftData: {
      coinShape?: string;
      materialFinish?: string;
      frontDescription?: string;
      frontImage?: string;
      frontText?: string;
      backDescription?: string;
      backImage?: string;
      backText?: string;
      generatorPrompt?: string;
      generatorImage?: string;
      description?: string; // Packaging preferences
      text?: string; // Packaging back text
    }) => {
      // Parse coinShape (e.g., "Diameter: 30mm, Thickness: 3mm")
      // Handle gracefully if coinShape is missing or malformed
      let coinDiameter = "";
      let coinThickness = "";
      if (draftData.coinShape) {
        try {
          const diameterMatch =
            draftData.coinShape.match(/Diameter:\s*([^,]+)/i);
          const thicknessMatch =
            draftData.coinShape.match(/Thickness:\s*(.+)/i);
          coinDiameter = diameterMatch ? diameterMatch[1].trim() : "";
          coinThickness = thicknessMatch ? thicknessMatch[1].trim() : "";
        } catch (error) {
          console.warn("Error parsing coinShape:", error);
          // Keep defaults as empty strings
        }
      }

      // Parse frontText and backText into top/bottom
      // Handle gracefully if text is missing
      const frontTextParts = draftData.frontText?.split("\n") || [];
      const backTextParts = draftData.backText?.split("\n") || [];

      // Handle packaging data if available
      const packagingPreferences = draftData.description || "";
      const packagingBackText = draftData.text || "";

      // Validate image URLs - must be non-empty strings
      const frontPreviewImage =
        draftData.frontImage && draftData.frontImage.trim()
          ? draftData.frontImage.trim()
          : draftData.generatorImage && draftData.generatorImage.trim()
            ? draftData.generatorImage.trim()
            : null;
      const backPreviewImage =
        draftData.backImage && draftData.backImage.trim()
          ? draftData.backImage.trim()
          : null;

      console.log("[useStandardBuilderStore] Loading draft data:", {
        rawFrontImage: draftData.frontImage,
        rawBackImage: draftData.backImage,
        rawGeneratorImage: draftData.generatorImage,
        hasFrontImage: !!frontPreviewImage,
        hasBackImage: !!backPreviewImage,
        frontImageUrl: frontPreviewImage?.substring(0, 80),
        backImageUrl: backPreviewImage?.substring(0, 80),
        coinDiameter,
        coinThickness,
        material: draftData.materialFinish,
      });

      set({
        dimensions: {
          coinDiameter: coinDiameter || "",
          coinThickness: coinThickness || "",
        },
        material: draftData.materialFinish || "",
        edgeType: "", // Not stored in draft structure - user will need to reselect
        textRings: {
          front: {
            top: frontTextParts[0] || "",
            bottom: frontTextParts[1] || "",
            noText: !draftData.frontText || draftData.frontText.trim() === "",
          },
          back: {
            top: backTextParts[0] || "",
            bottom: backTextParts[1] || "",
            noText: !draftData.backText || draftData.backText.trim() === "",
          },
        },
        artwork: {
          front: {
            prompt:
              draftData.frontDescription || draftData.generatorPrompt || "",
            attachedImage: null,
            uploadedImage: null,
            previewImage: frontPreviewImage,
          },
          back: {
            prompt: draftData.backDescription || "",
            attachedImage: null,
            uploadedImage: null,
            previewImage: backPreviewImage,
          },
        },
        packaging: {
          preferences: packagingPreferences || "",
          backText: packagingBackText || "",
        },
      });

      // Verify images were set
      const state = get();
      console.log(
        "[useStandardBuilderStore] After loading - Front previewImage:",
        state.artwork.front.previewImage?.substring(0, 80),
      );
      console.log(
        "[useStandardBuilderStore] After loading - Back previewImage:",
        state.artwork.back.previewImage?.substring(0, 80),
      );
      console.log(
        "[useStandardBuilderStore] After loading - Front prompt:",
        state.artwork.front.prompt?.substring(0, 30),
      );
      console.log(
        "[useStandardBuilderStore] After loading - Back prompt:",
        state.artwork.back.prompt?.substring(0, 30),
      );
    },

    reset: () =>
      set({
        dimensions: { coinDiameter: "", coinThickness: "" },
        material: "",
        edgeType: "",
        textRings: {
          front: {
            top: "YOUR TEXT HERE",
            bottom: "CUSTOM TEXT",
            noText: false,
          },
          back: { top: "YOUR TEXT HERE", bottom: "CUSTOM TEXT", noText: false },
        },
        artwork: {
          front: {
            prompt: "",
            attachedImage: null,
            uploadedImage: null,
            // Default placeholder image - simple gray square
            previewImage:
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EFront Image%3C/text%3E%3C/svg%3E",
          },
          back: {
            prompt: "",
            attachedImage: null,
            uploadedImage: null,
            // Default placeholder image - simple gray square
            previewImage:
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EBack Image%3C/text%3E%3C/svg%3E",
          },
        },
        packaging: {
          preferences: "",
          backText: "",
        },
        currentDraftId: null,
      }),
  }),
);
