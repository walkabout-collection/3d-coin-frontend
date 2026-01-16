import { create } from "zustand";
import { QAFormData } from "../components/AIGenerator/types";

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

// ============================================
// COIN DESIGN INTERFACE STORE - VARIANT ALLOCATION ARCHITECTURE
// ============================================

interface Image {
  id: string;
  url: string;
  timestamp: number;
}

interface TabState {
  image: Image | null; // Single image for this side (Front or Back)
  prompt: string; // Current prompt text
  attachedImage: File | null; // Manually attached image in prompt box
}

interface CoinDesignStore {
  // Design ID from backend
  designId: string | null;
  currentDraftId: string | null; // Track current draft ID

  // Tab states
  front: TabState;
  back: TabState;
  additionalVariants: Image[]; // Extra variants from initial generation

  // Actions - Design ID
  setDesignId: (id: string) => void;
  setCurrentDraftId: (draftId: string | null) => void;

  // Actions - Front Tab
  setFrontImage: (imageUrl: string) => void;
  removeFrontImage: () => void;
  setFrontPrompt: (prompt: string) => void;
  setFrontAttachedImage: (file: File | null) => void;
  replaceFrontImage: (newImageUrl: string) => void;

  // Actions - Back Tab
  setBackImage: (imageUrl: string) => void;
  removeBackImage: () => void;
  setBackPrompt: (prompt: string) => void;
  setBackAttachedImage: (file: File | null) => void;
  replaceBackImage: (newImageUrl: string) => void;

  // Actions - Variants
  setVariants: (variants: string[]) => void; // Set Front, Back, and additional from API
  addAdditionalVariant: (imageUrl: string) => void;
  removeAdditionalVariant: (imageId: string) => void;

  // Draft Actions
  getDesignDataForDraft: () => {
    name?: string;
    generatorPrompt?: string;
    generatorImage?: string;
    frontDescription?: string;
    frontImage?: string;
    backDescription?: string;
    backImage?: string;
  };
  loadDraftData: (draftData: {
    generatorPrompt?: string;
    generatorImage?: string;
    frontDescription?: string;
    frontImage?: string;
    backDescription?: string;
    backImage?: string;
  }) => void;

  // Utility
  reset: () => void;
}

const initialTabState: TabState = {
  image: null,
  prompt: "",
  attachedImage: null,
};

export const useCoinDesignStore = create<CoinDesignStore>((set, get) => ({
  designId: null,
  currentDraftId: null,
  front: initialTabState,
  back: initialTabState,
  additionalVariants: [],

  // ============ DESIGN ID ACTION ============
  setDesignId: (id: string) => set({ designId: id }),
  setCurrentDraftId: (draftId: string | null) =>
    set({ currentDraftId: draftId }),

  // ============ FRONT TAB ACTIONS ============
  setFrontImage: (imageUrl: string) =>
    set((state) => ({
      front: {
        ...state.front,
        image: {
          id: `front-${Date.now()}`,
          url: imageUrl,
          timestamp: Date.now(),
        },
      },
    })),

  removeFrontImage: () =>
    set((state) => ({
      front: { ...state.front, image: null },
    })),

  setFrontPrompt: (prompt: string) =>
    set((state) => ({
      front: { ...state.front, prompt },
    })),

  setFrontAttachedImage: (file: File | null) =>
    set((state) => ({
      front: { ...state.front, attachedImage: file },
    })),

  replaceFrontImage: (newImageUrl: string) =>
    set((state) => ({
      front: {
        ...state.front,
        image: state.front.image
          ? {
              ...state.front.image,
              url: newImageUrl,
              timestamp: Date.now(),
            }
          : {
              id: `front-${Date.now()}`,
              url: newImageUrl,
              timestamp: Date.now(),
            },
      },
    })),

  // ============ BACK TAB ACTIONS ============
  setBackImage: (imageUrl: string) =>
    set((state) => ({
      back: {
        ...state.back,
        image: {
          id: `back-${Date.now()}`,
          url: imageUrl,
          timestamp: Date.now(),
        },
      },
    })),

  removeBackImage: () =>
    set((state) => ({
      back: { ...state.back, image: null },
    })),

  setBackPrompt: (prompt: string) =>
    set((state) => ({
      back: { ...state.back, prompt },
    })),

  setBackAttachedImage: (file: File | null) =>
    set((state) => ({
      back: { ...state.back, attachedImage: file },
    })),

  replaceBackImage: (newImageUrl: string) =>
    set((state) => ({
      back: {
        ...state.back,
        image: state.back.image
          ? {
              ...state.back.image,
              url: newImageUrl,
              timestamp: Date.now(),
            }
          : {
              id: `back-${Date.now()}`,
              url: newImageUrl,
              timestamp: Date.now(),
            },
      },
    })),

  // ============ VARIANT ALLOCATION ============
  setVariants: (variants: string[]) =>
    set(() => {
      const timestamp = Date.now();

      // Variant 1 → Front Image
      const frontImage = variants[0]
        ? {
            id: `front-${timestamp}`,
            url: variants[0],
            timestamp,
          }
        : null;

      // Variant 2 → Back Image
      const backImage = variants[1]
        ? {
            id: `back-${timestamp}`,
            url: variants[1],
            timestamp,
          }
        : null;

      // Variant 3+ → Additional variants
      const additional = variants.slice(2).map((url, index) => ({
        id: `additional-${timestamp}-${index}`,
        url,
        timestamp,
      }));

      return {
        front: {
          ...initialTabState,
          image: frontImage,
        },
        back: {
          ...initialTabState,
          image: backImage,
        },
        additionalVariants: additional,
      };
    }),

  addAdditionalVariant: (imageUrl: string) =>
    set((state) => ({
      additionalVariants: [
        ...state.additionalVariants,
        {
          id: `additional-${Date.now()}`,
          url: imageUrl,
          timestamp: Date.now(),
        },
      ],
    })),

  removeAdditionalVariant: (imageId: string) =>
    set((state) => ({
      additionalVariants: state.additionalVariants.filter(
        (img) => img.id !== imageId,
      ),
    })),

  // ============ DRAFT ACTIONS ============
  getDesignDataForDraft: () => {
    const state = get();
    // Transform to flat API structure
    return {
      name: `AI Generator Draft - ${new Date().toLocaleDateString()}`,
      builderType: "AI Generator" as const,
      generatorPrompt: state.front.prompt || state.back.prompt || undefined,
      generatorImage:
        state.front.image?.url || state.back.image?.url || undefined,
      frontDescription: state.front.prompt || undefined,
      frontImage: state.front.image?.url || undefined,
      backDescription: state.back.prompt || undefined,
      backImage: state.back.image?.url || undefined,
    };
  },
  loadDraftData: (draftData: {
    generatorPrompt?: string;
    generatorImage?: string;
    frontDescription?: string;
    frontImage?: string;
    backDescription?: string;
    backImage?: string;
  }) => {
    // Handle missing or partial data gracefully
    // Validate image URLs - must be non-empty strings
    const frontImageUrl =
      draftData.frontImage && draftData.frontImage.trim()
        ? draftData.frontImage.trim()
        : null;
    const backImageUrl =
      draftData.backImage && draftData.backImage.trim()
        ? draftData.backImage.trim()
        : null;
    const frontPrompt =
      draftData.frontDescription || draftData.generatorPrompt || "";
    const backPrompt = draftData.backDescription || "";

    console.log("[useCoinStore] Loading draft data:", {
      rawFrontImage: draftData.frontImage,
      rawBackImage: draftData.backImage,
      hasFrontImage: !!frontImageUrl,
      hasBackImage: !!backImageUrl,
      frontImageUrl: frontImageUrl?.substring(0, 80),
      backImageUrl: backImageUrl?.substring(0, 80),
      frontPrompt: frontPrompt.substring(0, 30),
      backPrompt: backPrompt.substring(0, 30),
    });

    set({
      designId: null, // Will be set when draft is loaded
      front: frontImageUrl
        ? {
            ...initialTabState,
            image: {
              id: `front-${Date.now()}`,
              url: frontImageUrl,
              timestamp: Date.now(),
            },
            prompt: frontPrompt,
          }
        : {
            ...initialTabState,
            prompt: frontPrompt,
          },
      back: backImageUrl
        ? {
            ...initialTabState,
            image: {
              id: `back-${Date.now()}`,
              url: backImageUrl,
              timestamp: Date.now(),
            },
            prompt: backPrompt,
          }
        : {
            ...initialTabState,
            prompt: backPrompt,
          },
      additionalVariants: [],
    });

    // Verify images were set
    const state = get();
    console.log(
      "[useCoinStore] After loading - Front image:",
      state.front.image?.url?.substring(0, 80),
    );
    console.log(
      "[useCoinStore] After loading - Back image:",
      state.back.image?.url?.substring(0, 80),
    );
    console.log(
      "[useCoinStore] After loading - Front prompt:",
      state.front.prompt?.substring(0, 30),
    );
    console.log(
      "[useCoinStore] After loading - Back prompt:",
      state.back.prompt?.substring(0, 30),
    );
  },

  // ============ UTILITY ============
  reset: () =>
    set({
      designId: null,
      currentDraftId: null,
      front: initialTabState,
      back: initialTabState,
      additionalVariants: [],
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

export const useQAPromptsStore = create<QAPromptsState>((set) => ({
  formData: {},
  isInProgress: false,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
      isInProgress: true,
    })),
  setInProgress: (status) => set({ isInProgress: status }),
  resetFormData: () => set({ formData: {}, isInProgress: false }),
}));
