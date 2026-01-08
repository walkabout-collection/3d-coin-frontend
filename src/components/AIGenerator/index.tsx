// // "use client";
// // import React, { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import Button from "../common/button/Button";
// // import { QAFormData } from "./types";
// // import CoinUploadScreen from "./CoinUpload";
// // import CoinDesignInterface from "./CoinDesignInterface";
// // import CoinPromptBox from "./CoinPromptBox";
// // import QAPromptsForm from "./QAPromptsForm";
// // import { ThreeDRender } from "./ThreeDRender";
// // import DesignSummarySection from "@/src/containers/design-summary";
// // import { useAiFlowStore } from "@/src/store/useAiFlowStore";

// // const AIGenerator: React.FC = () => {
// //   const router = useRouter();
// //   const { state, uploadData, goTo, goBack, setUploadData, reset } = useAiFlowStore();

// //   useEffect(() => {
// //     reset();
// //   }, [reset]);

// //   useEffect(() => {
// //     const handlePopState = () => goBack();
// //     window.addEventListener("popstate", handlePopState);
// //     return () => window.removeEventListener("popstate", handlePopState);
// //   }, [goBack]);

// //   const handleProvideImageClick = () => {
// //     goTo("upload");
// //     window.history.pushState({ screen: "upload" }, "", window.location.href);
// //   };

// //   const handleEnterGuideClick = () => {
// //     goTo("guide");
// //     window.history.pushState({ screen: "guide" }, "", window.location.href);
// //   };

// //   const handleFileChange = (file: File | null) => {
// //     setUploadData({ image: file, variants: undefined });
// //   };

// //   const handleGenerate = (variants?: string[]) => {
// //     goTo("design", { variants });
// //     window.history.pushState({ screen: "design" }, "", window.location.href);
// //   };

// //   const handlePromptGenerate = (variants?: string[]) => {
// //     goTo("design", { variants });
// //     window.history.pushState({ screen: "design" }, "", window.location.href);
// //   };

// //   const handleContinue = () => {
// //     goTo("qaPrompts");
// //     window.history.pushState({ screen: "qaPrompts" }, "", window.location.href);
// //   };

// //   const handleQASubmit = (data: QAFormData) => {
// //     localStorage.setItem("qaFormData", JSON.stringify(data));
// //     goTo("threeDRender");
// //     window.history.pushState({ screen: "threeDRender" }, "", window.location.href);
// //   };

// //   const handleSaveAsDraft = async () => {
// //     console.log("Saving as draft...");
// //     await new Promise((resolve) => setTimeout(resolve, 2000));
// //   };

// //   const handleContinueRender = async () => {
// //     console.log("Continuing to next step...");
// //     await new Promise((resolve) => setTimeout(resolve, 1500));
// //     router.push("/design-summary");
// //   };

// //   // conditional renders
// //   if (state.showDesignInterface) {
// //     return <CoinDesignInterface onContinue={handleContinue} variants={uploadData.variants} />;
// //   }

// //   if (state.showUpload) {
// //     return (
// //       <CoinUploadScreen
// //         onFileChange={handleFileChange}
// //         image={uploadData.image}
// //         onGenerate={handleGenerate}
// //       />
// //     );
// //   }

// //   if (state.showGuide) {
// //     return <CoinPromptBox onGenerate={handlePromptGenerate} />;
// //   }

// //   if (state.showQAPrompts) {
// //     return <QAPromptsForm onSubmit={handleQASubmit} />;
// //   }

// //   if (state.showThreeDRender) {
// //     return (
// //       <ThreeDRender
// //         name="AI Generated 3D Render"
// //         onSaveAsDraft={handleSaveAsDraft}
// //         onContinue={handleContinueRender}
// //         loading={false}
// //       />
// //     );
// //   }

// //   if (state.showDesignSummary) {
// //     return <DesignSummarySection />;
// //   }

// //   return (
// //     <div className="min-h-screen">
// //       <div className="py-16">
// //         <div className="text-center px-4">
// //           <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mt-28">
// //             AI GENERATOR
// //           </h1>
// //           <div className="flex flex-col md:flex-row justify-center gap-6 max-w-lg mx-auto mt-14">
// //             <Button
// //               onClick={handleProvideImageClick}
// //               type="button"
// //               variant="ternary"
// //               className="!bg-gray-100 border-none font-medium py-6 px-6 rounded-lg hover:border-amber-500 hover:border-2 hover:bg-white hover:shadow-amber-400 hover:shadow-sm text-center"
// //             >
// //               <div className="text-lg leading-tight">
// //                 PROVIDE IMAGE OF<br />EXACT DESIGN
// //               </div>
// //             </Button>
// //             <Button
// //               onClick={handleEnterGuideClick}
// //               type="button"
// //               variant="ternary"
// //               className="!bg-gray-100 border-none font-medium py-5 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
// //             >
// //               <div className="text-lg leading-tight">
// //                 ENTER GENERATOR<br />GUIDE
// //               </div>
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AIGenerator;

// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";
// import Button from "../common/button/Button";
// import { QAFormData } from "./types";
// import CoinUploadScreen from "./CoinUpload";
// import CoinDesignInterface from "./CoinDesignInterface";
// import CoinPromptBox from "./CoinPromptBox";
// import QAPromptsForm from "./QAPromptsForm";
// import { ThreeDRender } from "./ThreeDRender";
// import DesignSummarySection from "@/src/containers/design-summary";
// import { useAiFlowStore } from "@/src/store/useAiFlowStore";

// const AIGenerator: React.FC = () => {
//   const router = useRouter();
//   const { state, uploadData, goTo, goBack, setUploadData, reset } = useAiFlowStore();

//   // useEffect(() => {
//   //   reset();
//   // }, [reset]);

//   // useEffect(() => {
//   //   const handlePopState = () => goBack();
//   //   window.addEventListener("popstate", handlePopState);
//   //   return () => window.removeEventListener("popstate", handlePopState);
//   // }, [goBack]);

//   // const handleProvideImageClick = () => {
//   //   goTo("upload");
//   //   window.history.pushState({ screen: "upload" }, "", window.location.href);
//   // };

//   // const handleEnterGuideClick = () => {
//   //   goTo("guide");
//   //   window.history.pushState({ screen: "guide" }, "", window.location.href);
//   // };

//   // const handleFileChange = (file: File | null) => {
//   //   setUploadData({ image: file, variants: undefined });
//   // };

//   // const handleGenerate = (variants?: string[]) => {
//   //   goTo("design", { variants });
//   //   window.history.pushState({ screen: "design" }, "", window.location.href);
//   // };

//   // const handlePromptGenerate = (variants?: string[]) => {
//   //   goTo("design", { variants });
//   //   window.history.pushState({ screen: "design" }, "", window.location.href);
//   // };

//   // const handleContinue = () => {
//   //   goTo("qaPrompts");
//   //   window.history.pushState({ screen: "qaPrompts" }, "", window.location.href);
//   // };

//   const handleQASubmit = (data: QAFormData) => {
//     localStorage.setItem("qaFormData", JSON.stringify(data));
//     goTo("threeDRender");
//     window.history.pushState({ screen: "threeDRender" }, "", window.location.href);
//   };

//   const handleSaveAsDraft = async () => {
//     console.log("Saving as draft...");
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   };

//   const handleContinueRender = async () => {
//     console.log("Continuing to next step...");
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//   };

//   // // conditional renders
//   // if (state.showDesignInterface) {
//   //   return <CoinDesignInterface onContinue={handleContinue} variants={uploadData.variants} />;
//   // }

//   // if (state.showUpload) {
//   //   return (
//   //     <CoinUploadScreen
//   //       onFileChange={handleFileChange}
//   //       image={uploadData.image}
//   //       onGenerate={handleGenerate}
//   //     />
//   //   );
//   // }

//   // if (state.showGuide) {
//   //   return <CoinPromptBox onGenerate={handlePromptGenerate} />;
//   // }

//   if (state.showQAPrompts) {
//     return <QAPromptsForm onSubmit={handleQASubmit} />;
//   }

//   if (state.showThreeDRender) {
//     return (
//       <ThreeDRender
//         name="AI Generated 3D Render"
//         onSaveAsDraft={handleSaveAsDraft}
//         onContinue={handleContinueRender}
//         loading={false}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="py-16">
//         <div className="text-center px-4">
//           <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mt-28">
//             AI GENERATOR
//           </h1>
//           {/* <div className="flex flex-col md:flex-row justify-center gap-6 max-w-lg mx-auto mt-14">
//             <Button
//               onClick={handleProvideImageClick}
//               type="button"
//               variant="ternary"
//               className="!bg-gray-100 border-none font-medium py-6 px-6 rounded-lg hover:border-amber-500 hover:border-2 hover:bg-white hover:shadow-amber-400 hover:shadow-sm text-center"
//             >
//               <div className="text-lg leading-tight">
//                 PROVIDE IMAGE OF<br />EXACT DESIGN
//               </div>
//             </Button>
//             <Button
//               onClick={handleEnterGuideClick}
//               type="button"
//               variant="ternary"
//               className="!bg-gray-100 border-none font-medium py-5 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
//             >
//               <div className="text-lg leading-tight">
//                 ENTER GENERATOR<br />GUIDE
//               </div>
//             </Button>
//           </div> */}
//           <QAPromptsForm onSubmit={handleQASubmit} />
//            <ThreeDRender

//         name="AI Generated 3D Render"
//         onSaveAsDraft={handleSaveAsDraft}
//         onContinue={handleContinueRender}
//         loading={false}
//       />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIGenerator;

// "use client";
// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Button from "../common/button/Button";
// import { QAFormData } from "./types";
// import CoinUploadScreen from "./CoinUpload";
// import CoinDesignInterface from "./CoinDesignInterface";
// import CoinPromptBox from "./CoinPromptBox";
// import QAPromptsForm from "./QAPromptsForm";
// import { ThreeDRender } from "./ThreeDRender";
// import DesignSummarySection from "@/src/containers/design-summary";
// import { useAiFlowStore } from "@/src/store/useAiFlowStore";

// const AIGenerator: React.FC = () => {
//   const router = useRouter();
//   const { state, uploadData, goTo, goBack, setUploadData, reset } = useAiFlowStore();

//   useEffect(() => {
//     reset();
//   }, [reset]);

//   useEffect(() => {
//     const handlePopState = () => goBack();
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [goBack]);

//   const handleProvideImageClick = () => {
//     goTo("upload");
//     window.history.pushState({ screen: "upload" }, "", window.location.href);
//   };

//   const handleEnterGuideClick = () => {
//     goTo("guide");
//     window.history.pushState({ screen: "guide" }, "", window.location.href);
//   };

//   const handleFileChange = (file: File | null) => {
//     setUploadData({ image: file, variants: undefined });
//   };

//   const handleGenerate = (variants?: string[]) => {
//     goTo("design", { variants });
//     window.history.pushState({ screen: "design" }, "", window.location.href);
//   };

//   const handlePromptGenerate = (variants?: string[]) => {
//     goTo("design", { variants });
//     window.history.pushState({ screen: "design" }, "", window.location.href);
//   };

//   const handleContinue = () => {
//     goTo("qaPrompts");
//     window.history.pushState({ screen: "qaPrompts" }, "", window.location.href);
//   };

//   const handleQASubmit = (data: QAFormData) => {
//     localStorage.setItem("qaFormData", JSON.stringify(data));
//     goTo("threeDRender");
//     window.history.pushState({ screen: "threeDRender" }, "", window.location.href);
//   };

//   const handleSaveAsDraft = async () => {
//     console.log("Saving as draft...");
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   };

//   const handleContinueRender = async () => {
//     console.log("Continuing to next step...");
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     router.push("/design-summary");
//   };

//   // conditional renders
//   if (state.showDesignInterface) {
//     return <CoinDesignInterface onContinue={handleContinue} variants={uploadData.variants} />;
//   }

//   if (state.showUpload) {
//     return (
//       <CoinUploadScreen
//         onFileChange={handleFileChange}
//         image={uploadData.image}
//         onGenerate={handleGenerate}
//       />
//     );
//   }

//   if (state.showGuide) {
//     return <CoinPromptBox onGenerate={handlePromptGenerate} />;
//   }

//   if (state.showQAPrompts) {
//     return <QAPromptsForm onSubmit={handleQASubmit} />;
//   }

//   if (state.showThreeDRender) {
//     return (
//       <ThreeDRender
//         name="AI Generated 3D Render"
//         onSaveAsDraft={handleSaveAsDraft}
//         onContinue={handleContinueRender}
//         loading={false}
//       />
//     );
//   }

//   if (state.showDesignSummary) {
//     return <DesignSummarySection />;
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="py-16">
//         <div className="text-center px-4">
//           <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mt-28">
//             AI GENERATOR
//           </h1>
//           <div className="flex flex-col md:flex-row justify-center gap-6 max-w-lg mx-auto mt-14">
//             <Button
//               onClick={handleProvideImageClick}
//               type="button"
//               variant="ternary"
//               className="!bg-gray-100 border-none font-medium py-6 px-6 rounded-lg hover:border-amber-500 hover:border-2 hover:bg-white hover:shadow-amber-400 hover:shadow-sm text-center"
//             >
//               <div className="text-lg leading-tight">
//                 PROVIDE IMAGE OF<br />EXACT DESIGN
//               </div>
//             </Button>
//             <Button
//               onClick={handleEnterGuideClick}
//               type="button"
//               variant="ternary"
//               className="!bg-gray-100 border-none font-medium py-5 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
//             >
//               <div className="text-lg leading-tight">
//                 ENTER GENERATOR<br />GUIDE
//               </div>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIGenerator;

"use client";
import React, { useEffect, useRef } from "react";
import Button from "../common/button/Button";
import { QAFormData } from "./types";
import CoinUploadScreen from "./CoinUpload";
import CoinDesignInterface from "./CoinDesignInterface";
import CoinPromptBox from "./CoinPromptBox";
import QAPromptsForm from "./QAPromptsForm";
import { ThreeDRender } from "./ThreeDRender";
import { useAiFlowStore } from "@/src/store/useAiFlowStore";
import {
  useCoinDesignStore,
  useQAPromptsStore,
} from "@/src/store/useCoinStore";

const AIGenerator: React.FC = () => {
  // removed unused `pathname`
  const hasResetRef = useRef(false);
  const {
    state,
    uploadData,
    historyStack,
    goTo,
    goBack,
    setUploadData,
    reset,
  } = useAiFlowStore();
  const { reset: resetDesignCoin, front, back } = useCoinDesignStore();
  const { resetFormData } = useQAPromptsStore();

  // Reset stores when navigating to custom-shapes page with stale persisted state
  // Fix: Prevents showing threeDRender screen directly when navigating from home
  useEffect(() => {
    // Only reset once per mount
    if (hasResetRef.current) return;
    hasResetRef.current = true;

    // If showing threeDRender screen on mount, check if it's stale persisted state
    // Stale state = showing threeDRender without proper flow context
    // (user didn't go through step-by-step, just navigated from another page)
    const showingThreeDRender = state.showThreeDRender;
    const hasValidFlowContext =
      historyStack &&
      historyStack.length > 2 && // More than just ["main", "threeDRender"]
      (front.image ||
        back.image ||
        state.showQAPrompts ||
        state.showDesignInterface);

    // Reset if showing threeDRender but missing proper flow context
    // This happens when user navigates with stale persisted state
    if (showingThreeDRender && !hasValidFlowContext) {
      // Clear all persisted stores from localStorage
      localStorage.removeItem("ai-flow-storage");
      localStorage.removeItem("coin-design-storage");
      localStorage.removeItem("qa-prompts-storage");

      // Reset all stores to initial state
      reset();
      resetDesignCoin();
      resetFormData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    const handlePopState = () => goBack();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [goBack]);

  const handleProvideImageClick = () => {
    // Reset stores when starting a fresh flow from the main screen
    reset();
    resetDesignCoin();
    resetFormData();
    goTo("upload");
    window.history.pushState({ screen: "upload" }, "", window.location.href);
  };

  const handleEnterGuideClick = () => {
    // Reset stores when starting a fresh flow from the main screen
    reset();
    resetDesignCoin();
    resetFormData();
    goTo("guide");
    window.history.pushState({ screen: "guide" }, "", window.location.href);
  };

  const handleFileChange = (file: File | null) => {
    setUploadData({ image: file, variants: undefined });
  };

  const handleGenerate = (generatedImages: string[]) => {
    // Images are already stored in useCoinDesignStore by CoinUploadScreen
    goTo("design", { variants: generatedImages });
    window.history.pushState({ screen: "design" }, "", window.location.href);
  };

  const handlePromptGenerate = (generatedImages?: string[]) => {
    // Images are already stored in useCoinDesignStore
    goTo("design", { variants: generatedImages });
    window.history.pushState({ screen: "design" }, "", window.location.href);
  };

  const handleContinue = () => {
    // Images are already persisted in useCoinDesignStore
    goTo("qaPrompts");
    window.history.pushState({ screen: "qaPrompts" }, "", window.location.href);
  };

  const handleQASubmit = (data: QAFormData) => {
    void data;
    // Data is already stored in Zustand via QAPromptsForm's onFormSubmit
    // Navigation is already handled in QAPromptsForm's onFormSubmit
    // This handler is kept for any additional logic if needed in the future
  };

  const handleSaveAsDraft = async () => {
    console.log("Saving as draft...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleContinueRender = async () => {
    console.log("Continuing to next step...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  // conditional renders
  if (state.showDesignInterface) {
    return (
      <CoinDesignInterface
        onContinue={handleContinue}
        initialImages={uploadData.variants}
      />
    );
  }

  if (state.showUpload) {
    return (
      <CoinUploadScreen
        onFileChange={handleFileChange}
        image={uploadData.image}
        onGenerate={handleGenerate}
      />
    );
  }

  if (state.showGuide) {
    return <CoinPromptBox onGenerate={handlePromptGenerate} />;
  }

  if (state.showQAPrompts) {
    return <QAPromptsForm onSubmit={handleQASubmit} />;
  }

  if (state.showThreeDRender) {
    return (
      <ThreeDRender
        name="AI Generated 3D Render"
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleContinueRender}
        loading={false}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-16">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mt-28">
            AI GENERATOR
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-lg mx-auto mt-14">
            <Button
              onClick={handleProvideImageClick}
              type="button"
              variant="ternary"
              className="!bg-gray-100 border-none font-medium py-6 px-6 rounded-lg hover:border-amber-500 hover:border-2 hover:bg-white hover:shadow-amber-400 hover:shadow-sm text-center"
            >
              <div className="text-lg leading-tight">
                PROVIDE IMAGE OF
                <br />
                EXACT DESIGN
              </div>
            </Button>
            <Button
              onClick={handleEnterGuideClick}
              type="button"
              variant="ternary"
              className="!bg-gray-100 border-none font-medium py-5 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
            >
              <div className="text-lg leading-tight">
                ENTER GENERATOR
                <br />
                GUIDE
              </div>
            </Button>
          </div>
          {/* <QAPromptsForm onSubmit={handleQASubmit} />
           <ThreeDRender
      
        name="AI Generated 3D Render"
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleContinueRender}
        loading={false}
      /> */}
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
