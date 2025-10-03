import { create } from "zustand";

interface CoinStore {
  coinImages: string[];
  setCoinImages: (images: string[]) => void;
  addCoinImage: (image: string) => void;
  clearCoinImages: () => void;
}

export const useCoinStore = create<CoinStore>((set) => ({
  coinImages: [],
  setCoinImages: (images) => set({ coinImages: images }),
  addCoinImage: (image) =>
    set((state) => ({ coinImages: [...state.coinImages, image] })),
  clearCoinImages: () => set({ coinImages: [] }),
}));
