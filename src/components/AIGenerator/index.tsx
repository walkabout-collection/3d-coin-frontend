"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../common/button/Button";
import {  QAFormData } from "./types";
import CoinUploadScreen from "./CoinUpload";
import CoinDesignInterface from "./CoinDesignInterface";
import CoinPromptBox from "./CoinPromptBox";
import QAPromptsForm from "./QAPromptsForm";
import { ThreeDRender } from "./ThreeDRender";
import DesignSummarySection from "@/src/containers/design-summary";
import { useAiFlowStore } from "@/src/store/useAiFlowStore";


const AIGenerator: React.FC = () => {
  const router = useRouter();
  const { state, uploadData, goTo, goBack, setUploadData } = useAiFlowStore();


  useEffect(() => {
    const handlePopState = () => goBack();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [goBack]);


  const handleProvideImageClick = () => {
    goTo("upload");
    window.history.pushState({ screen: "upload" }, "", window.location.href);
  };


  const handleEnterGuideClick = () => {
    goTo("guide");
    window.history.pushState({ screen: "guide" }, "", window.location.href);
  };


  const handleFileChange = (file: File | null) => {
    setUploadData({ image: file, variants: undefined });
  };


  const handleGenerate = (variants?: string[]) => {
    goTo("design", { variants });
    window.history.pushState({ screen: "design" }, "", window.location.href);
  };


  const handlePromptGenerate = (variants?: string[]) => {
    goTo("design", { variants });
    window.history.pushState({ screen: "design" }, "", window.location.href);
  };


  const handleContinue = () => {
    goTo("qaPrompts");
    window.history.pushState({ screen: "qaPrompts" }, "", window.location.href);
  };


  const handleQASubmit = (data: QAFormData) => {
    localStorage.setItem("qaFormData", JSON.stringify(data));
    goTo("threeDRender");
    window.history.pushState({ screen: "threeDRender" }, "", window.location.href);
  };


  const handleSaveAsDraft = async () => {
    console.log("Saving as draft...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };


  const handleContinueRender = async () => {
    console.log("Continuing to next step...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/design-summary");
  };


  const handleEdit = () => {
    goTo("qaPrompts");
    window.history.pushState({ screen: "qaPrompts" }, "", window.location.href);
  };


  // conditional renders
  if (state.showDesignInterface) {
    return <CoinDesignInterface onContinue={handleContinue} variants={uploadData.variants} />;
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
        frontImage={uploadData.variants?.[0] || "/images/home/front-side.png"}
        backImage={uploadData.variants?.[1] || "/images/home/front-side.png"}
        title="AI Generated 3D Render"
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleContinueRender}
        loading={false}
      />
    );
  }


  if (state.showDesignSummary) {
    return <DesignSummarySection onEdit={handleEdit} />;
  }


  // main entry screen
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
                PROVIDE IMAGE OF<br />EXACT DESIGN
              </div>
            </Button>
            <Button
              onClick={handleEnterGuideClick}
              type="button"
              variant="ternary"
              className="!bg-gray-100 border-none font-medium py-5 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
            >
              <div className="text-lg leading-tight">
                ENTER GENERATOR<br />GUIDE
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AIGenerator;
