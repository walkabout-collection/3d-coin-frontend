import React from 'react';
import Image from 'next/image';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: string[];
}

const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({ isOpen, onClose, questions }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-20 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
=      <div
        className={`fixed top-14 right-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-[450px] flex flex-col`}
      >
        <div className="p-8 pb-5">
          <div className="flex flex-col items-center text-center mb-8">
            {/* Chatbot Icon */}
            <div className="rounded-full p-4 mb- mt-10">
              <Image
                src="/images/home/bot-icon.svg"
                alt="Chatbot Assistant"
                width={90}
                height={90}
                className=""
              />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              HELLO, I AM YOUR
            </h3>
            <h4 className="text-xl font-bold text-gray-900">
              CREATION ASSISTANT
            </h4>
          </div>
        </div>

        <div className="flex-1 px-8">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between py-5 px-4 bg-gray-100 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <span className="text-gray-700 text-md font-semibold leading-relaxed pr-4">
                    {question}
                  </span>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Share Your Thoughts"
              className="w-full p-4 border-2 border-yellow-400 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 text-sm"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>

        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-5xl font-light transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </>
  );
};

export default ChatbotDrawer;