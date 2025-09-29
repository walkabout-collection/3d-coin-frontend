import { create } from "zustand";

interface CoinStore {
  aiImages: string[]; 
  setAIImages: (images: string[]) => void;
  addAIImage: (image: string) => void;
  clearAIImages: () => void;
}

export const useCoinStore = create<CoinStore>((set) => ({
  aiImages: [],
  setAIImages: (images) => set({ aiImages: images }),
  addAIImage: (image) =>
    set((state) => ({ aiImages: [...state.aiImages, image] })),
  clearAIImages: () => set({ aiImages: [] }),
}));
