import { routes } from "@/src/constants/routes";
import { NavItem, SocialLink, InstaImage } from "./types";

export const menuItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Pricing", href: routes.PRICING.path },
  { title: "Case Studies", href: "/case-studies" },
  { title: "Features", href: "/features" },
  { title: "Downloads", href: "/downloads" },
  { title: "Updates", href: "/updates" },
  { title: "Changelog", href: "/changelog" },
];

export const companyItems: NavItem[] = [
  { title: routes.ABOUT_US.title, href: routes.ABOUT_US.path },
  { title: routes.CONTACT_US.title, href: routes.CONTACT_US.path },
  { title: "Careers", href: "/careers" },
  { title: "Culture", href: "/culture" },
  { title: "Help Center", href: "/help" },
  { title: "Support", href: "/support" },
  { title: "Legal", href: "/legal" },
];

export const instaImages: InstaImage[] = [
  { src: "/images/footer/Footer-Coin1.png", alt: "Coin design 1" },
  { src: "/images/footer/Footer-Coin2.png", alt: "Coin design 2" },
  { src: "/images/footer/Footer-Coin3.png", alt: "Coin design 3" },
  { src: "/images/footer/Footer-Coin4.png", alt: "Coin design 4" },
];

export const socialLinks: SocialLink[] = [
  { icon: "/images/footer/SocialMediaIcons/Facebook.png", href: "https://facebook.com", alt: "Facebook" },
  { icon: "/images/footer/SocialMediaIcons/Twitter.png", href: "https://twitter.com", alt: "Twitter" },
  { icon: "/images/footer/SocialMediaIcons/Instagram.png", href: "https://instagram.com", alt: "Instagram" },
  { icon: "/images/footer/SocialMediaIcons/Linkedin.png", href: "https://linkedin.com", alt: "LinkedIn" },
  { icon: "/images/footer/SocialMediaIcons/YouTube.png", href: "https://youtube.com", alt: "YouTube" },
];
