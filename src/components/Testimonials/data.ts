import client1Image from '@/public/images/home/client1.svg';
import client2Image from '@/public/images/home/client2.svg';
import client3Image from '@/public/images/home/client1.svg';
import { TestimonialsData } from './types';

export const testimonialsData: TestimonialsData = {
  mainTitle: "See What Our Clients",
  subtitle: "Say About Us:",
  testimonials: [
    {
      id: 1,
      name: "Sarah M.",
      title: "Event Organizer",
      testimonial: "The custom coins for our corporate event were absolutely perfect! The quality exceeded our expectations and our team was thrilled with the results.",
      rating: 5,
      image: client1Image
    },
    {
      id: 2,
      name: "David R.",
      title: "Homeowner",
      testimonial: "We Used Legacy Forge Coins For Our Military Reunion — They Were Stunning!",
      rating: 5,
      image: client2Image
    },
    {
      id: 3,
      name: "Maria L.",
      title: "Business Owner",
      testimonial: "Outstanding service and beautiful craftsmanship! Our commemorative coins became the highlight of our anniversary celebration.",
      rating: 5,
      image: client3Image
    }
  ]
};
