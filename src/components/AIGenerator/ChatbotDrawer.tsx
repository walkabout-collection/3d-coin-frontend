import React from "react";
import Image from "next/image";

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  questions,
  onQuestionClick,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
  <div
  className={`fixed bottom-0 right-0 h-[calc(100%-56px)] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
    isOpen ? "translate-x-0" : "translate-x-full"
  } w-[450px] flex flex-col z-40`}
>

        <div className="p-8 pb-5">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="rounded-full p-4 mt-10">
              <Image
                src="/images/home/bot-icon.svg"
                alt="Chatbot Assistant"
                width={30}
                height={30}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              LOOKING FOR INSPIRATIONS
            </h3>
          </div>
        </div>

        <div className="flex-1 px-8">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => onQuestionClick(question)}
              >
                <div className="flex items-center justify-between py-5 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                  <span className="text-gray-700 text-md font-semibold leading-relaxed pr-4">
                    {question}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotDrawer;