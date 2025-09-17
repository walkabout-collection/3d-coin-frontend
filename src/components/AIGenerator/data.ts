import { ChatbotQuestions, ChatbotState, GeneratorState, Option, UIState } from "./types";

export const initialGeneratorState: GeneratorState = {
  showUpload: false,
  showGuide: false,
  showDesignInterface: false, 
  showQAPrompts: false,
  showThreeDRender: false,
  showDesignSummary: false  
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



export const metalFinishesOptions: Option[] = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'copper', label: 'Copper' },
  { value: 'black-nickel', label: 'Black Nickel' },
  { value: 'gold-antique', label: 'Gold Antique' },
];

export const coinStylesOptions: Option[] = [
  { value: 'emblem-clean-vector', label: 'Emblem (Clean Vector)' },
  { value: 'engraved-metal', label: 'Engraved Metal' },
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'enamel-filling', label: 'Enamel Filling' },
  { value: 'user-defined', label: 'User Defined' },
];

export const detailLevelOptions: Option[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'medium', label: 'Medium' },
  { value: 'highly-detailed', label: 'Highly Detailed' },
];

export const referenceImageImpactOptions: Option[] = [
  { value: 'trace', label: 'Trace' },
  { value: 'literal', label: 'Literal' },
  { value: 'inspire', label: 'Inspire' },
];

export const coinShapeOptions: Option[] = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'oval', label: 'Oval' },
  { value: 'custom', label: 'Custom Shape' },
];

export const placeholderTexts = {
  coinShape: 'Describe the shape of the coin',
  subject: 'Describe the overall imagery of the coin in detail',
  frontDescription: 'Provide detailed description of front side design',
  backDescription: 'Provide detailed description of back side design',
  frontTextInsideArtwork: 'Enter text and description of where in the design',
  backTextInsideArtwork: 'Enter text and description of where in the design',
  frontTextStyle: 'Provide font type or describe font',
  backTextStyle: 'Provide font type or describe font',
  frontCompositionNotes: 'Write note',
  backCompositionNotes: 'Write note',
  prohibitedContent: 'Write the content you want to avoid',
};

export const exampleTexts = {
  compositionNotes: 'E.g. "Centered crest, no elements touching edge," "Top heavy, leaves room at bottom."',
  prohibitedContent: 'Anything to avoid (skulls, guns, gradients, etc.)',
};


export const buttonTexts = {
  saveAsDraft: 'Save As Draft',
  continue: 'Submit',
  loading: 'Processing...',
};