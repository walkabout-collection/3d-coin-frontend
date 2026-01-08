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
  }) => void;

  reset: () => void;
}

export const useStandardBuilderStore = create<StandardBuilderState>(
  (set, get) => ({
    dimensions: { coinDiameter: "", coinThickness: "" },
    material: "",
    edgeType: "",
    textRings: {
      front: { top: "", bottom: "", noText: false },
      back: { top: "", bottom: "", noText: false },
    },
    artwork: {
      front: {
        prompt: "",
        attachedImage: null,
        uploadedImage: null,
        previewImage: null,
      },
      back: {
        prompt: "",
        attachedImage: null,
        uploadedImage: null,
        previewImage: null,
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
    }) => {
      // Parse coinShape (e.g., "Diameter: 30mm, Thickness: 3mm")
      let coinDiameter = "";
      let coinThickness = "";
      if (draftData.coinShape) {
        const diameterMatch = draftData.coinShape.match(/Diameter:\s*([^,]+)/);
        const thicknessMatch = draftData.coinShape.match(/Thickness:\s*(.+)/);
        coinDiameter = diameterMatch ? diameterMatch[1].trim() : "";
        coinThickness = thicknessMatch ? thicknessMatch[1].trim() : "";
      }

      // Parse frontText and backText into top/bottom
      const frontTextParts = draftData.frontText?.split("\n") || [];
      const backTextParts = draftData.backText?.split("\n") || [];

      set({
        dimensions: {
          coinDiameter,
          coinThickness,
        },
        material: draftData.materialFinish || "",
        edgeType: "", // Not available in flat structure
        textRings: {
          front: {
            top: frontTextParts[0] || "",
            bottom: frontTextParts[1] || "",
            noText: !draftData.frontText,
          },
          back: {
            top: backTextParts[0] || "",
            bottom: backTextParts[1] || "",
            noText: !draftData.backText,
          },
        },
        artwork: {
          front: {
            prompt:
              draftData.frontDescription || draftData.generatorPrompt || "",
            attachedImage: null,
            uploadedImage: null,
            previewImage:
              draftData.frontImage || draftData.generatorImage || null,
          },
          back: {
            prompt: draftData.backDescription || "",
            attachedImage: null,
            uploadedImage: null,
            previewImage: draftData.backImage || null,
          },
        },
        packaging: {
          preferences: "",
          backText: "",
        },
      });
    },

    reset: () =>
      set({
        dimensions: { coinDiameter: "", coinThickness: "" },
        material: "",
        edgeType: "",
        textRings: {
          front: { top: "", bottom: "", noText: false },
          back: { top: "", bottom: "", noText: false },
        },
        artwork: {
          front: {
            prompt: "",
            attachedImage: null,
            uploadedImage: null,
            previewImage: null,
          },
          back: {
            prompt: "",
            attachedImage: null,
            uploadedImage: null,
            previewImage: null,
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
