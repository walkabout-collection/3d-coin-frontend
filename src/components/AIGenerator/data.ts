import { ChatbotQuestions, ChatbotState, GeneratorState, UIState } from "./types";

export const initialGeneratorState: GeneratorState = {
  showUpload: false,
  showGuide: false,
  showDesignInterface: false, 
};

export const initialUIState: UIState = {
  previewImage: null,
  thumbnails: [
    '/images/home/gallery1.jpg',
    '/images/military.png',
    '/images/thumbnail3.jpg',
    '/images/thumbnail4.jpg',
  ],
  isLoggedIn: false,
};
export const initialChatbotState: ChatbotState = {
  isDrawerOpen: false,
};

export const chatbotQuestions: ChatbotQuestions = {
  questions: [
    "What types of coins can I design?",
    "How do I upload a custom image?",
    "What is the regeneration process?",
    "Can I save my designs?",
  ],
};