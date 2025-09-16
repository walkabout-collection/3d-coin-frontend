export interface GeneratorState {
  showUpload: boolean;
  showGuide: boolean;
  showDesignInterface: boolean;
  showQAPrompts: boolean;
  showThreeDRender: boolean;
  showDesignSummary: boolean; 
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



export interface Option {
  value: string;
  label: string;
}

export interface QAFormData {
  coinShape: string;
  subject: string;
  metalFinishes: string;
  coinStyles: string;
  detailLevel: string;
  frontDescription: string;
  frontReferenceImage: File ; 
  frontReferenceImageImpact: string;
  frontTextInsideArtwork: string;
  frontTextStyle: string;
  frontCompositionNotes: string;
  backDescription: string;
  backReferenceImage: File; 
  backReferenceImageImpact: string;
  backTextInsideArtwork: string;
  backTextStyle: string;
  backCompositionNotes: string;
  prohibitedContent: string;
}

export interface QAPromptsFormProps {
  onSubmit: (data: QAFormData) => void;
  initialData?: Partial<QAFormData>;
}




export interface ThreeDRenderProps {
  frontImage?: string; 
  backImage?: string;  
  title?: string;
  onSaveAsDraft?: () => void;
  onContinue?: () => void;
  className?: string;
  loading?: boolean;
}
