// data.ts
import militaryPoliceImage from '@/public/images/home/military.png';
import weddingsImage from '@/public/images/home/military.png'
import retirementImage from '@/public/images/home/military.png'
import corporationsImage from '@/public/images/home/military.png'
import parksImage from '@/public/images/home/military.png'
import { WhoWeBuildForItem } from './types';

export const whoWeBuildForData: WhoWeBuildForItem[] = [
  {
    title: 'Military & Police',
    description: 'From personal milestones to professional recognition, custom coins make moments unforgettable.',
    image: militaryPoliceImage,
  },
  {
    title: 'Weddings & Anniversaries',
    description: 'Timeless keepsakes for couples and guests.',
    image: weddingsImage,
  },
  {
    title: 'Retirement & Recognition',
    description: 'Celebrate milestones with lasting symbols of achievement.',
    image: retirementImage,
  },
  {
    title: 'Corporations & Teams',
    description: 'Custom branded coins that inspire unity and pride.',
    image: corporationsImage,
  },
  {
    title: 'National & State Parks',
    description: 'Collectible designs that preserve the beauty of America\'s parks.',
    image: parksImage,
  },
];