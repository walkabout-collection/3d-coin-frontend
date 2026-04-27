export interface GuidedOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  promptFragment: string;
}

export interface GuidedSelection {
  purpose: string | null;
  style: string | null;
  symbol: string | null;
  text: string;
}

export const purposeOptions: GuidedOption[] = [
  {
    value: "military",
    label: "Military",
    description: "Unit, challenge, or service coin",
    icon: "🎖️",
    promptFragment: "military challenge coin representing a service unit",
  },
  {
    value: "corporate",
    label: "Corporate",
    description: "Company milestone or award",
    icon: "🏢",
    promptFragment: "corporate commemorative coin for a company milestone",
  },
  {
    value: "anniversary",
    label: "Anniversary",
    description: "Celebrate a year or event",
    icon: "🎉",
    promptFragment:
      "anniversary commemorative coin celebrating a milestone year",
  },
  {
    value: "commemorative",
    label: "Commemorative",
    description: "Honor a person or moment",
    icon: "🏅",
    promptFragment: "commemorative coin honoring a meaningful occasion",
  },
  {
    value: "sports",
    label: "Sports",
    description: "Team, tournament, or award",
    icon: "🏆",
    promptFragment: "sports commemorative coin for a team or tournament",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Something else entirely",
    icon: "✨",
    promptFragment: "custom-designed collectible coin",
  },
];

export const styleOptions: GuidedOption[] = [
  {
    value: "antique-gold",
    label: "Antique Gold",
    description: "Warm, worn, classic feel",
    promptFragment:
      "antique gold finish with slightly worn texture and warm patina, high relief",
  },
  {
    value: "polished-silver",
    label: "Polished Silver",
    description: "Bright, mirror-like finish",
    promptFragment:
      "polished silver with mirror-like reflections and crisp detailing",
  },
  {
    value: "3d-relief",
    label: "3D Relief",
    description: "Deep, sculpted detail",
    promptFragment:
      "deep 3D relief sculpting with dramatic shadows and intricate depth",
  },
  {
    value: "enamel-color",
    label: "Enamel Color",
    description: "Vibrant colored inlays",
    promptFragment:
      "enamel color inlays with vibrant contrast against metal base",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Clean, modern, simple",
    promptFragment:
      "minimalist modern design with clean lines and negative space",
  },
  {
    value: "bronze-patina",
    label: "Bronze Patina",
    description: "Aged bronze with character",
    promptFragment:
      "aged bronze with natural patina, textured surface, historical character",
  },
];

export const symbolOptions: GuidedOption[] = [
  {
    value: "eagle",
    label: "Eagle",
    icon: "🦅",
    promptFragment: "majestic eagle with spread wings in high relief",
  },
  {
    value: "star",
    label: "Star",
    icon: "⭐",
    promptFragment: "prominent star motif centered in the composition",
  },
  {
    value: "shield",
    label: "Shield",
    icon: "🛡️",
    promptFragment: "heraldic shield crest with detailed emblem",
  },
  {
    value: "laurel",
    label: "Laurel Wreath",
    icon: "🌿",
    promptFragment: "laurel wreath bordering the main artwork",
  },
  {
    value: "flag",
    label: "Flag",
    icon: "🚩",
    promptFragment: "flowing flag element integrated into the design",
  },
  {
    value: "crown",
    label: "Crown",
    icon: "👑",
    promptFragment: "ornate crown symbolizing honor and authority",
  },
  {
    value: "sword",
    label: "Sword",
    icon: "⚔️",
    promptFragment: "crossed swords in high relief detail",
  },
  {
    value: "none",
    label: "No central symbol",
    icon: "—",
    promptFragment: "clean central composition without a dominant symbol",
  },
];

const BASE_QUALITY_PROMPT =
  "Hyper-realistic 3D render, slightly tilted for depth, cinematic studio lighting, soft shadows, dark gradient background, shallow depth of field, macro lens, photorealistic 8K, premium product visualization, subtle reflection beneath coin.";

export function composePrompt(selection: GuidedSelection): string {
  const purpose = purposeOptions.find((p) => p.value === selection.purpose);
  const style = styleOptions.find((s) => s.value === selection.style);
  const symbol = symbolOptions.find((s) => s.value === selection.symbol);
  const text = selection.text.trim();

  const parts: string[] = [];

  if (purpose) {
    parts.push(`A ${purpose.promptFragment}.`);
  }

  if (style) {
    parts.push(`Style: ${style.promptFragment}.`);
  }

  if (symbol && symbol.value !== "none") {
    parts.push(`Artwork: ${symbol.promptFragment}.`);
  } else if (symbol && symbol.value === "none") {
    parts.push(`Artwork: ${symbol.promptFragment}.`);
  }

  if (text) {
    parts.push(`Text Rings: "${text}" embossed around the rim.`);
  }

  parts.push(BASE_QUALITY_PROMPT);

  return parts.join(" ");
}
