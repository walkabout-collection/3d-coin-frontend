import { CoinBuilderSection } from './types';
import coinBuilderImage1 from '@/public/images/home/coin-builder-classic.png'
import coinBuilderImage2 from '@/public/images/home/coin-builder-custom.png'
import designTeamImage from '@/public/images/home/coin-builder-teams.png';

export const coinBuilderSections: CoinBuilderSection[] = [
  {
    title: 'Build Classic Challenge Coins in 3D — Instantly',
    subtitle: "Standard Challenge Coin 3D Builder",
    description: 'Perfect for traditional challenge coins and commemoratives. Our 3D builder lets you customize materials, text, images, and finishes in real time.',
    image: coinBuilderImage1,
    buttonText: 'Launch the 3D Builder',
    link: '/standard',
  },
  {
    title: 'Want Custom Shapes? Push Creativity Beyond the Circle',
    subtitle: "Custom Shape Challenge Coin Generator",
    description: 'Design brand shapes, symbols, or abstract art with our AI-powered generator. If you can imagine it, we can mint it.',
    image: coinBuilderImage2,
    buttonText: 'Try AI Generator',
    link: '/custom-shapes',
  },
  {
    title: 'Work Directly with Expert Designers',
      subtitle: "Design With Our Team",
    description: 'When you have a vision but want professional polish, our design team collaborates with you to create something unforgettable.',
    image: designTeamImage,
    buttonText: 'Work with Designers',
    link: '/contact-us',
  },
];