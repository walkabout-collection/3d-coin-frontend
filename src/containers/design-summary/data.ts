import { BottomButton } from "./types";

export const designOptions = [
  {
    id: 1,
    label: "Dimensions",
    value: "17\"",
    type: "size",
    image: "/images/home/dimensions.png"
  },
  {
    id: 2,
    label: "Material",
    value: "Brass",
    type: "material",
    image: "/images/home/dimensions.png"
  },
  {
    id: 3,
    label: "Edge Type",
    value: "Smooth",
    type: "edge",
    image: "/images/home/dimensions.png"
  },
  {
    id: 4,
    label: "Text Rings",
    value: "Top Left",
    type: "text",
    image: "/images/home/dimensions.png"
  },
  {
    id: 5,
    label: "Artwork",
    value: "Top Text",
    type: "artwork",
    image: "/images/home/dimensions.png"
  }
];

export const bottomButtons: BottomButton[] = [
  {
    id: 1,
    label: "Bingo Exactly Right",
    active: false
  },
  {
    id: 2,
    label: "Need Designer Attention",
    active: true
  },
  {
    id: 3,
    label: "Go Direct With Manual Adjust",
    active: false
  }
];