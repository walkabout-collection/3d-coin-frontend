'use client'
import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import Button from '../common/button/Button';

interface UIState {
  previewImage: string | null;
  selectedThumbnail: number | null;
  isLoggedIn: boolean;
}

interface ImageData {
  file: File | null;
}

const initialUIState: UIState = {
  previewImage: null,
  selectedThumbnail: null,
  isLoggedIn: true
};



const CoinDesignInterface: React.FC = () => {
  const [state, setState] = useState<UIState>(initialUIState);
  const [imageData, setImageData] = useState<ImageData>({ file: null });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      
      setUploadedImages(prev => {
        const newImages = [...prev, imageUrl];
        return newImages.slice(-4); 
      });
      
      setState((prev) => ({ 
        ...prev, 
        previewImage: imageUrl,
        selectedThumbnail: uploadedImages.length
      }));
      
      setImageData({ file });
    }
  };

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setState(prev => ({
      ...prev,
      previewImage: imageUrl,
      selectedThumbnail: index
    }));
  };

  const handleRegenerate = () => {
    if (imageData.file) {
      alert('Regenerating design with uploaded image!');
    } else {
      alert('Please attach an image first!');
    }
  };

  const handleSaveDraft = () => {
    alert('Design saved as draft!');
  };

  const handleContinue = () => {
    alert('Continuing to next step!');
  };

  return (
    <div className="min-h-screen ">
    

      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Section - Input Area */}
          <div className="flex flex-col">
            <div className="relative mb-8">
              <textarea
                className="w-full  p-6 border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500  text-lg"
                placeholder="Ask anything…"
                rows={10}
              />
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <button
                  className="flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Paperclip size={16} />
                  <span className="text-sm font-medium">Attach</span>
                </button>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                
                <Button
                  className="px-6 py-2 text-sm max-w-[140px] text-white"
                  onClick={handleRegenerate}
                  variant="primary"
                >
                  Regenerate
                </Button>
              </div>
            </div>

            {/* Thumbnail Images Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {uploadedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      state.selectedThumbnail === index 
                        ? 'ring-4 ring-yellow-400 shadow-lg' 
                        : 'ring-2 ring-gray-200 hover:ring-yellow-300'
                    }`}
                    onClick={() => handleThumbnailClick(imageUrl, index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-500 leading-relaxed">
                <p className="uppercase tracking-wide">
                  Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem ipsum has been the industry's standard
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Preview */}
          <div className="flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-xl">
                {state.previewImage ? (
                  <img
                    src={state.previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🪙</div>
                      <div className="text-lg font-medium">No design selected</div>
                      <div className="text-sm">Upload an image to preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
           <div className="flex justify-between gap-6 mt-8">
          <Button
            type="button"
            variant="ternary"
            onClick={handleSaveDraft}
            className="max-w-[180px] w-full text-md font-base !bg-gray-200 border-none"
          >
            SAVE AS DRAFT
          </Button>

          <Button
            onClick={handleContinue}
            type="button"
            variant="primary"
            className="max-w-[180px] w-full text-lg font-medium"
          >
            CONTINUE
          </Button>
        </div>
          </div>
        </div>
      </div>

       </div>
  );
};

export default CoinDesignInterface;