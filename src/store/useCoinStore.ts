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

export const useCoinDesignStore = create<CoinDesignStore>()(
  persist(
    (set, get) => ({
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
        set({
          designId: null, // Will be set when draft is loaded
          front: draftData.frontImage
            ? {
                ...initialTabState,
                image: {
                  id: `front-${Date.now()}`,
                  url: draftData.frontImage,
                  timestamp: Date.now(),
                },
                prompt:
                  draftData.frontDescription || draftData.generatorPrompt || "",
              }
            : {
                ...initialTabState,
                prompt:
                  draftData.frontDescription || draftData.generatorPrompt || "",
              },
          back: draftData.backImage
            ? {
                ...initialTabState,
                image: {
                  id: `back-${Date.now()}`,
                  url: draftData.backImage,
                  timestamp: Date.now(),
                },
                prompt: draftData.backDescription || "",
              }
            : {
                ...initialTabState,
                prompt: draftData.backDescription || "",
              },
          additionalVariants: [],
        });
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
    }),
    {
      name: "coin-design-storage",
      // Persist everything except File objects (can't be serialized)
      partialize: (state) => ({
        designId: state.designId,
        currentDraftId: state.currentDraftId,
        front: {
          ...state.front,
          attachedImage: null, // Don't persist File objects
        },
        back: {
          ...state.back,
          attachedImage: null,
        },
        additionalVariants: state.additionalVariants,
      }),
    },
  ),
);

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
      // Exclude large image URLs from persistence to avoid localStorage quota exceeded error
      // Images are already stored in useCoinDesignStore
      partialize: (state) => ({
        formData: {
          ...state.formData,
          // Exclude image URLs (they can be very large base64 strings)
          frontReferenceImage: undefined,
          backReferenceImage: undefined,
        },
        isInProgress: state.isInProgress,
      }),
    },
  ),
);
