'use client';
import React, { useState } from 'react';
import { initialGeneratorState } from './data';
import { GeneratorState, UploadData } from './types';
import CoinUploadScreen from './CoinUpload';
import CoinDesignInterface from './CoinDesignInterface';
import CoinPromptBox from './CoinPromptBox'; 

const AIGenerator: React.FC = () => {
  const [state, setState] = useState<GeneratorState>(initialGeneratorState);
  const [uploadData, setUploadData] = useState<UploadData>({ image: null });

  const handleProvideImageClick = () => {
    setState({ showUpload: true, showGuide: false, showDesignInterface: false });
  };

  const handleEnterGuideClick = () => {
    setState({ showUpload: false, showGuide: true, showDesignInterface: false });
  };

  const handleFileChange = (file: File | null) => {
    setUploadData({ image: file });
  };

  const handleGenerate = () => {
    if (uploadData.image) {
      setState((prev) => ({ ...prev, showUpload: false, showGuide: false, showDesignInterface: true }));
    } else {
      console.log('Please upload an image first!');
    }
  };

  const handlePromptGenerate = () => {
    setState((prev) => ({ ...prev, showGuide: false, showDesignInterface: true }));
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
    return (
      <CoinPromptBox
        onGenerate={handlePromptGenerate}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen py-16">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-40">
            AI GENERATOR
          </h1>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-2xl mx-auto mt-20">
            <button
              onClick={handleProvideImageClick}
              className="bg-gray-100 text-gray-800 hover:text-black font-semibold py-6 px-9 rounded-lg hover:border-amber-500 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
            >
              <div className="text-lg leading-tight">
                PROVIDE IMAGE OF<br />
                EXACT DESIGN
              </div>
            </button>
            
            <button
              onClick={handleEnterGuideClick} 
              className="bg-gray-100 text-gray-800 hover:text-black font-semibold py-6 px-9 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
            >
              <div className="text-lg leading-tight">
                ENTER GENERATOR<br />
                GUIDE
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;