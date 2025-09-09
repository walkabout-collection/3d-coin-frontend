import { GeneratorState, UIState } from "./types";

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