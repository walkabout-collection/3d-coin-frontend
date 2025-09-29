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

  setDimensions: (data: Dimensions) => void;
  setMaterial: (material: string) => void;
  setEdgeType: (edgeType: string) => void;
  setTextRings: (rings: TextRings) => void;
  setArtwork: (artwork: Artwork) => void;
  updateArtworkSide: (side: "front" | "back", data: Partial<ArtworkSide>) => void;
  setPackaging: (data: Packaging) => void;

  reset: () => void;
}

export const useStandardBuilderStore = create<StandardBuilderState>((set) => ({
  dimensions: { coinDiameter: "", coinThickness: "" },
  material: "",
  edgeType: "",
  textRings: {
    front: { top: "", bottom: "", noText: false },
    back: { top: "", bottom: "", noText: false },
  },
  artwork: {
    front: { prompt: "", attachedImage: null, uploadedImage: null, previewImage: null },
    back: { prompt: "", attachedImage: null, uploadedImage: null, previewImage: null },
  },
   packaging: {
    preferences: "",
    backText: "",
  },

  setDimensions: (data) => set((state) => ({ dimensions: { ...state.dimensions, ...data } })),
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
        front: { prompt: "", attachedImage: null, uploadedImage: null, previewImage: null },
        back: { prompt: "", attachedImage: null, uploadedImage: null, previewImage: null },
      },
      packaging: {
        preferences: "",
        backText: "",
      },
    }),
}));
