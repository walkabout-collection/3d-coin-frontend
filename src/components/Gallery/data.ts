import gallery1Image from '@/public/images/home/gallery1.png';
import gallery2Image from '@/public/images/home/gallery2.png';
import gallery3Image from '@/public/images/home/gallery3.png';
import { GalleryData } from './types';

export const galleryData: GalleryData = {
  title: "Gallery",
  items: [
    {
      id: 1,
      title: "Designed With",
      subtitle: "AI Generator",
      image: gallery1Image
    },
    {
      id: 2,
      title: "Created In",
      subtitle: "3D Builder",
      image: gallery2Image
    },
    {
      id: 3,
      title: "Designed With",
      subtitle: "AI Generator",
      image: gallery3Image
    },
    {
      id: 4,
      title: "Crafted By",
      subtitle: "Expert Artisans",
      image: gallery1Image
    },
    {
      id: 5,
      title: "Premium",
      subtitle: "Quality Design",
      image: gallery2Image
    },
    {
        id: 6,
        title: "Custom Shapes",
        subtitle: "Unique Styles",
        image: gallery3Image
      },
  ]
};