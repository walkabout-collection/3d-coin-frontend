import { create } from "zustand";
import { QAFormData } from "../components/AIGenerator/types";
import { persist } from "zustand/middleware";

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

// coin design interface
interface CoinStoreState {
  frontImages: string[];
  backImages: string[];
  addFrontImage: (image: string) => void;
  addBackImage: (image: string) => void;
  setInitialImages: (variants: string[]) => void;
  reset: () => void;
}

export const useDesignCoinStore = create<CoinStoreState>((set) => ({
  frontImages: [],
  backImages: [],
  addFrontImage: (image) =>
    set((state) => ({
      frontImages: [...state.frontImages, image].slice(-4),
    })),
  addBackImage: (image) =>
    set((state) => ({
      backImages: [...state.backImages, image].slice(-4),
    })),
  setInitialImages: (variants) => {
    const front = variants.filter((_, i) => i % 2 === 0).slice(-4);
    const back = variants.filter((_, i) => i % 2 === 1).slice(-4);
    set({
      frontImages: front,
      backImages: back,
    });
  },
  reset: () =>
    set({
      frontImages: [],
      backImages: [],
    }),
}));

// QA PROMPTS
interface QAPromptsState {
  formData: Partial<QAFormData>;
  isInProgress: boolean;
  setFormData: (data: Partial<QAFormData>) => void;
  setInProgress: (status: boolean) => void;
  resetFormData: () => void;
}

export const useQAPromptsStore = create<QAPromptsState>()(
  persist(
    (set) => ({
      formData: {},
      isInProgress: false,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
          isInProgress: true, 
        })),
      setInProgress: (status) => set({ isInProgress: status }),
      resetFormData: () => set({ formData: {}, isInProgress: false }),
    }),
    {
      name: "qa-prompts-storage",
    }
  )
);