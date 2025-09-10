'use client';
import React, { useState, useEffect } from 'react';
import { initialGeneratorState } from './data';
import { GeneratorState, UploadData } from './types';
import CoinUploadScreen from './CoinUpload';
import CoinDesignInterface from './CoinDesignInterface';
import CoinPromptBox from './CoinPromptBox';
import Button from '../common/button/Button';

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
          setState({ showUpload: true, showGuide: false, showDesignInterface: false });
        } else if (previousState === 'guide') {
          setState({ showUpload: false, showGuide: true, showDesignInterface: false });
        } else if (previousState === 'design') {
          setState({ showUpload: false, showGuide: false, showDesignInterface: true });
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
    setState({ showUpload: true, showGuide: false, showDesignInterface: false });
    setHistoryStack((prev) => [...prev, 'upload']);
    window.history.pushState({ screen: 'upload' }, '', window.location.href);
  };

  const handleEnterGuideClick = () => {
    setState({ showUpload: false, showGuide: true, showDesignInterface: false });
    setHistoryStack((prev) => [...prev, 'guide']);
    window.history.pushState({ screen: 'guide' }, '', window.location.href);
  };

  const handleFileChange = (file: File | null) => {
    setUploadData({ image: file });
  };

  const handleGenerate = () => {
    setState((prev) => ({ ...prev, showUpload: false, showGuide: false, showDesignInterface: true }));
    setHistoryStack((prev) => [...prev, 'design']);
    window.history.pushState({ screen: 'design' }, '', window.location.href);
  };

  const handlePromptGenerate = () => {
    setState((prev) => ({ ...prev, showGuide: false, showDesignInterface: true }));
    setHistoryStack((prev) => [...prev, 'design']);
    window.history.pushState({ screen: 'design' }, '', window.location.href);
  };

  if (state.showDesignInterface) {
    return <CoinDesignInterface />;
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
              className="!bg-gray-100 border-none font-medium py-6 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
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