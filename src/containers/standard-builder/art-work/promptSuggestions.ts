export interface ThemeOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  promptFragment: string;
}

export interface StyleOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  promptFragment: string;
  qualitySuffix: string;
}

export const themeOptions: ThemeOption[] = [
  {
    value: "eagle",
    label: "Heraldic Eagle",
    icon: "🦅",
    description: "Majestic eagle with spread wings",
    promptFragment:
      "a majestic bald eagle with spread wings in high relief, heraldic style, detailed feathers and sharp gaze",
  },
  {
    value: "military",
    label: "Military Crest",
    icon: "🎖️",
    description: "Crossed swords and shield",
    promptFragment:
      "crossed swords over a heraldic shield with laurel wreath border, military challenge coin style",
  },
  {
    value: "sports",
    label: "Sports Trophy",
    icon: "🏆",
    description: "Trophy on radiant starburst",
    promptFragment:
      "a tournament trophy cup centered on a radiant starburst, sports commemorative coin",
  },
  {
    value: "corporate",
    label: "Corporate Logo",
    icon: "💼",
    description: "Clean modern emblem",
    promptFragment:
      "a clean minimalist corporate emblem with modern geometric lines, company milestone coin",
  },
  {
    value: "anniversary",
    label: "Anniversary Year",
    icon: "🎂",
    description: "Milestone year with ribbon",
    promptFragment:
      'a large commemorative year "25" in elegant serif numerals, surrounded by a decorative ribbon and star accents',
  },
  {
    value: "crown",
    label: "Royal Crown",
    icon: "👑",
    description: "Ornate crown with jewels",
    promptFragment:
      "an ornate royal crown with fine jeweled detail, heraldic style with deep sculpted relief",
  },
  {
    value: "star",
    label: "Star / Minimal",
    icon: "✨",
    description: "Single bold star, clean",
    promptFragment:
      "a single large star centered on a clean field with subtle radial lines, minimalist modern design",
  },
  {
    value: "lion",
    label: "Lion Emblem",
    icon: "🦁",
    description: "Noble lion head crest",
    promptFragment:
      "a noble lion head emblem with flowing mane, heraldic style with deep sculpted 3D relief",
  },
];

export const styleOptions: StyleOption[] = [
  {
    value: "photorealistic",
    label: "Photorealistic",
    icon: "📸",
    description: "Lifelike, detailed",
    promptFragment:
      "photorealistic rendering with lifelike detail, natural lighting, and fine metallic texture",
    qualitySuffix:
      "Ultra-realistic photograph, 8K resolution, cinematic studio lighting, shallow depth of field, sharp focus, true-to-life materials.",
  },
  {
    value: "illustration",
    label: "Illustration",
    icon: "🖼️",
    description: "Hand-drawn artistic",
    promptFragment:
      "artistic hand-drawn illustration with clean line work and painterly shading",
    qualitySuffix:
      "Detailed digital illustration, visible brush strokes, soft color gradients, artistic composition, NOT photorealistic.",
  },
  {
    value: "3d-render",
    label: "3D Render",
    icon: "🧊",
    description: "Sculpted, dimensional",
    promptFragment:
      "high-quality 3D sculpted render with deep relief, dramatic shadows, and dimensional detail",
    qualitySuffix:
      "Hyper-realistic 3D render, dramatic directional lighting, deep sculpted relief, premium product visualization.",
  },
  {
    value: "cartoon",
    label: "Cartoon",
    icon: "🦸",
    description: "Bold, playful style",
    promptFragment:
      "cartoon character style with bold clean outlines, flat vibrant colors, and playful exaggerated shapes",
    qualitySuffix:
      "Flat 2D cartoon illustration, thick black outlines, saturated colors, simple cel shading, animated style, NOT photorealistic, NOT 3D.",
  },
  {
    value: "vintage",
    label: "Vintage / Retro",
    icon: "🕰️",
    description: "Aged, nostalgic",
    promptFragment:
      "vintage retro design with aged texture, muted sepia color palette, and classic old-world character",
    qualitySuffix:
      "Vintage retro art style, weathered paper texture, faded warm tones, early 20th-century poster aesthetic, grainy nostalgic feel.",
  },
  {
    value: "futuristic",
    label: "Futuristic",
    icon: "🤖",
    description: "Sleek, high-tech",
    promptFragment:
      "futuristic sci-fi design with sleek metallic surfaces, glowing neon accents, and high-tech detailing",
    qualitySuffix:
      "Cyberpunk sci-fi concept art, glowing neon highlights, sleek chrome and carbon textures, dramatic rim lighting, cinematic futuristic atmosphere.",
  },
];

export function composeImagePrompt(
  side: "front" | "back",
  themeValue: string,
  styleValue: string,
): string {
  const theme = themeOptions.find((t) => t.value === themeValue);
  const style = styleOptions.find((s) => s.value === styleValue);

  if (!theme || !style) return "";

  return [
    `${side === "front" ? "Front" : "Back"} side of a coin featuring ${theme.promptFragment}.`,
    `Style: ${style.promptFragment}.`,
    style.qualitySuffix,
  ].join(" ");
}
