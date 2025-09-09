export interface GeneratorState {
  showUpload: boolean;
  showGuide: boolean;
  showDesignInterface: boolean;
}

export interface UploadData {
  image: File | null;
}

export interface UIState {
  previewImage: string | null;
  thumbnails: string[];
  isLoggedIn: boolean;
}

export interface ImageData {
  file: File | null;
}
export interface ChatbotState {
  isDrawerOpen: boolean;
}

export interface ChatbotQuestions {
  questions: string[];
}