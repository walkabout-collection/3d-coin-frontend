'use client';
import React, { useState, useEffect } from 'react';
import { initialGeneratorState } from './data';
import { GeneratorState, QAFormData, UploadData } from './types';
import CoinUploadScreen from './CoinUpload';
import CoinDesignInterface from './CoinDesignInterface';
import CoinPromptBox from './CoinPromptBox';
import QAPromptsForm from './QAPromptsForm';
import Button from '../common/button/Button';
import { ThreeDRender } from './ThreeDRender';

const AIGenerator: React.FC = () => {
  const [state, setState] = useState<GeneratorState>(initialGeneratorState);
  const [uploadData, setUploadData] = useState<UploadData>({ image: null });
  const [historyStack, setHistoryStack] = useState<string[]>(['main']);

  useEffect(() => {
    const handlePopState = () => {
      setHistoryStack((prev) => {
        const newStack = [...prev];
        newStack.pop();
        const previousState = newStack[newStack.length - 1] || 'main';

        if (previousState === 'main') {
          setState(initialGeneratorState);
        } else if (previousState === 'upload') {
          setState({ showUpload: true, showGuide: false, showDesignInterface: false, showQAPrompts: false, showThreeDRender: false });
        } else if (previousState === 'guide') {
          setState({ showUpload: false, showGuide: true, showDesignInterface: false, showQAPrompts: false, showThreeDRender: false });
        } else if (previousState === 'design') {
          setState({ showUpload: false, showGuide: false, showDesignInterface: true, showQAPrompts: false, showThreeDRender: false });
        } else if (previousState === 'qaPrompts') {
          setState({ showUpload: false, showGuide: false, showDesignInterface: false, showQAPrompts: true, showThreeDRender: false });
        } else if (previousState === 'threeDRender') {
          setState({ showUpload: false, showGuide: false, showDesignInterface: false, showQAPrompts: false, showThreeDRender: true });
        }

        return newStack;
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleProvideImageClick = () => {
    setState({ showUpload: true, showGuide: false, showDesignInterface: false, showQAPrompts: false, showThreeDRender: false });
    setHistoryStack((prev) => [...prev, 'upload']);
    window.history.pushState({ screen: 'upload' }, '', window.location.href);
  };

  const handleEnterGuideClick = () => {
    setState({ showUpload: false, showGuide: true, showDesignInterface: false, showQAPrompts: false, showThreeDRender: false });
    setHistoryStack((prev) => [...prev, 'guide']);
    window.history.pushState({ screen: 'guide' }, '', window.location.href);
  };

  const handleFileChange = (file: File | null) => {
    setUploadData({ image: file });
  };

  const handleGenerate = () => {
    setState((prev) => ({ ...prev, showUpload: false, showGuide: false, showDesignInterface: true, showQAPrompts: false, showThreeDRender: false }));
    setHistoryStack((prev) => [...prev, 'design']);
    window.history.pushState({ screen: 'design' }, '', window.location.href);
  };

  const handlePromptGenerate = () => {
    setState((prev) => ({ ...prev, showGuide: false, showDesignInterface: true, showQAPrompts: false, showThreeDRender: false }));
    setHistoryStack((prev) => [...prev, 'design']);
    window.history.pushState({ screen: 'design' }, '', window.location.href);
  };

  const handleContinue = () => {
    setState({ showUpload: false, showGuide: false, showDesignInterface: false, showQAPrompts: true, showThreeDRender: false });
    setHistoryStack((prev) => [...prev, 'qaPrompts']);
    window.history.pushState({ screen: 'qaPrompts' }, '', window.location.href);
  };

  const handleQASubmit = (data: QAFormData) => {
    console.log('Q&A Form Data:', data);
    setState({ showUpload: false, showGuide: false, showDesignInterface: false, showQAPrompts: false, showThreeDRender: true });
    setHistoryStack((prev) => [...prev, 'threeDRender']);
    window.history.pushState({ screen: 'threeDRender' }, '', window.location.href);
  };
   const frontImage =  '/images/home/gallery1.png';
  const backImage =  '/images/home/gallery2.png';
    const handleSaveAsDraft = async () => {
    console.log('Saving as draft...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const draftData = {
      frontImage,
      backImage,
      savedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    alert('Saved as draft successfully!');
  };

  const handleContinueRender = async () => {
    console.log('Continuing to next step...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Proceeding to next step...');
  };

  if (state.showDesignInterface) {
    return <CoinDesignInterface onContinue={handleContinue} />;
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
    return   <ThreeDRender
        frontImage={frontImage}
        backImage={backImage}
        title="AI Generated 3D Render"
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleContinueRender}
        loading={false}
      />
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
                PROVIDE IMAGE OF<br />
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
                ENTER GENERATOR<br />
                GUIDE
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;

