import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialGeneratorState } from "../components/AIGenerator/data";
import { GeneratorState } from "../components/AIGenerator/types";

interface UploadData {
  image: File | null;
  variants?: string[];
}

type Screen =
  | "main"
  | "upload"
  | "guide"
  | "design"
  | "qaPrompts"
  | "threeDRender"
  | "designSummary";

interface AiFlowStore {
  state: GeneratorState;
  uploadData: UploadData;
  historyStack: Screen[];

  // actions
  goTo: (
    screen: Screen,
    options?: { variants?: string[]; file?: File | null },
  ) => void;
  goBack: () => void;
  setUploadData: (data: Partial<UploadData>) => void;
  reset: () => void;
  clearPersistedState: () => void; // Clear localStorage
}

export const useAiFlowStore = create<AiFlowStore>()(
  persist(
    (set) => ({
      state: initialGeneratorState,
      uploadData: { image: null },
      historyStack: ["main"],

      goTo: (screen, options) =>
        set((prev) => {
          const newState: GeneratorState = { ...initialGeneratorState };

          if (screen === "upload") newState.showUpload = true;
          if (screen === "guide") newState.showGuide = true;
          if (screen === "design") newState.showDesignInterface = true;
          if (screen === "qaPrompts") newState.showQAPrompts = true;
          if (screen === "threeDRender") newState.showThreeDRender = true;
          if (screen === "designSummary") newState.showDesignSummary = true;

          return {
            state: newState,
            uploadData: {
              image: options?.file ?? prev.uploadData.image,
              variants: options?.variants ?? prev.uploadData.variants,
            },
            historyStack: [...prev.historyStack, screen],
          };
        }),

      goBack: () =>
        set((prev) => {
          const newStack = [...prev.historyStack];
          newStack.pop();
          const previous = newStack[newStack.length - 1] || "main";

          const newState: GeneratorState = { ...initialGeneratorState };
          if (previous === "upload") newState.showUpload = true;
          if (previous === "guide") newState.showGuide = true;
          if (previous === "design") newState.showDesignInterface = true;
          if (previous === "qaPrompts") newState.showQAPrompts = true;
          if (previous === "threeDRender") newState.showThreeDRender = true;
          if (previous === "designSummary") newState.showDesignSummary = true;

          return {
            state: newState,
            historyStack: newStack,
          };
        }),

      setUploadData: (data) =>
        set((prev) => ({
          uploadData: { ...prev.uploadData, ...data },
        })),

      reset: () =>
        set({
          state: initialGeneratorState,
          uploadData: { image: null },
          historyStack: ["main"],
        }),

      clearPersistedState: () => {
        // Clear localStorage for this store
        localStorage.removeItem("ai-flow-storage");
        set({
          state: initialGeneratorState,
          uploadData: { image: null },
          historyStack: ["main"],
        });
      },
    }),
    {
      name: "ai-flow-storage",
      // Persist both uploadData and current screen state
      // This allows users to refresh and stay on the same page
      partialize: (state) => ({
        uploadData: state.uploadData,
        state: state.state,
        historyStack: state.historyStack,
      }),
    },
  ),
);
