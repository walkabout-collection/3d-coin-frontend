export interface GeneratorState {
  showUpload: boolean;
  showGuide: boolean;
  showDesignInterface: boolean;
}

export interface UploadData {
  image: File | null;
}

// types.ts
export interface UIState {
  previewImage: string | null;
  thumbnails: string[];
  isLoggedIn: boolean;
}

export interface ImageData {
  file: File | null;
}