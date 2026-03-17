import {
  ChatbotQuestions,
  ChatbotState,
  GeneratorState,
  Option,
  UIState,
} from "./types";

export const initialGeneratorState: GeneratorState = {
  showUpload: false,
  showGuide: false,
  showDesignInterface: false,
  showQAPrompts: false,
  showThreeDRender: false,
  showDesignSummary: false,
};

export const initialUIState: UIState = {
  previewImage: null,
  thumbnails: [
    "/images/home/gallery1.jpg",
    "/images/military.png",
    "/images/thumbnail3.jpg",
    "/images/thumbnail4.jpg",
  ],
  isLoggedIn: false,
};
export const initialChatbotState: ChatbotState = {
  isDrawerOpen: false,
};

export const chatbotQuestions: ChatbotQuestions = {
  questions: [
    "Prompt 1 – Classic Gold Eagle Coin: Hyper-realistic 3D render of a luxury coin, slightly tilted for depth. Material: polished gold with realistic reflections. Edge Type: reeded grooves. Text Rings: “EXCELLENCE • HONOR • LEGACY” embossed around rim. Artwork: majestic eagle with spread wings in high relief, intricate feathers, metallic shading. Ultra-detailed 8K, cinematic studio lighting, soft shadows, dark gradient background, shallow depth of field, macro lens, photorealistic, premium product visualization, subtle reflection beneath coin.",
    "Prompt 2 – Antique Silver Historical Coin: 3D render of an antique silver coin, slightly worn and textured. Material: brushed silver with scratches and patina. Edge Type: smooth beveled edge. Text Rings: “HERITAGE • HISTORY • 1826” engraved around border. Artwork: historical crest with shield and laurel, high relief, detailed engraving. Cinematic lighting, soft shadows, dark vintage background, shallow depth of field, photorealistic 8K, realistic reflections, premium collectible style.",
    "Prompt 3 – Modern Crypto Coin: Hyper-realistic 3D render of a modern cryptocurrency coin, metallic and sleek. Material: polished platinum with reflective shine. Edge Type: rope edge with fine detail. Text Rings: “BLOCKCHAIN • FUTURE • 2026” embossed. Artwork: abstract geometric crypto logo in high relief, futuristic metallic shading. Ultra-detailed 8K, studio lighting, soft shadows, dark gradient background, macro lens, shallow depth of field, photorealistic luxury product render, subtle reflection.",
    "Prompt 4 – Gaming Fantasy Coin: 3D render of a fantasy-themed gaming coin, highly detailed and slightly tilted. Material: bronze with worn texture and scratches. Edge Type: beveled with ornate engraving. Text Rings: “VICTORY • QUEST • LEVEL UP” embossed around rim. Artwork: dragon coiled around a gemstone, high relief, intricate scales and metallic highlights. Cinematic lighting, soft shadows, dark mystical background, shallow depth of field, ultra-realistic 8K render, premium collectible coin style, subtle reflection.",
  ],
};

export const metalFinishesOptions: Option[] = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "copper", label: "Copper" },
  { value: "black-nickel", label: "Black Nickel" },
  { value: "gold-antique", label: "Gold Antique" },
];

export const coinStylesOptions: Option[] = [
  { value: "emblem-clean-vector", label: "Emblem (Clean Vector)" },
  { value: "engraved-metal", label: "Engraved Metal" },
  { value: "photorealistic", label: "Photorealistic" },
  { value: "enamel-filling", label: "Enamel Filling" },
  { value: "user-defined", label: "User Defined" },
];

export const detailLevelOptions: Option[] = [
  { value: "minimal", label: "Minimal" },
  { value: "medium", label: "Medium" },
  { value: "highly-detailed", label: "Highly Detailed" },
];

export const referenceImageImpactOptions: Option[] = [
  { value: "trace", label: "Trace" },
  { value: "literal", label: "Literal" },
  { value: "inspire", label: "Inspire" },
];

export const coinShapeOptions: Option[] = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "hexagon", label: "Hexagon" },
  { value: "oval", label: "Oval" },
  { value: "custom", label: "Custom Shape" },
];

export const placeholderTexts = {
  coinShape: "Describe the shape of the coin",
  subject: "Describe the overall imagery of the coin in detail",
  frontDescription: "Provide detailed description of front side design",
  backDescription: "Provide detailed description of back side design",
  frontTextInsideArtwork: "Enter text and description of where in the design",
  backTextInsideArtwork: "Enter text and description of where in the design",
  frontTextStyle: "Provide font type or describe font",
  backTextStyle: "Provide font type or describe font",
  frontCompositionNotes: "Write note",
  backCompositionNotes: "Write note",
  prohibitedContent: "Write the content you want to avoid",
};

export const exampleTexts = {
  compositionNotes:
    'E.g. "Centered crest, no elements touching edge," "Top heavy, leaves room at bottom."',
  prohibitedContent: "Anything to avoid (skulls, guns, gradients, etc.)",
};

export const buttonTexts = {
  saveAsDraft: "Save As Draft",
  continue: "Submit",
  loading: "Processing...",
};
