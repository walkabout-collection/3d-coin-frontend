export interface NavItem {
  title: string;
  href: string;
}

export interface SocialLink {
  icon: string; // path to image in /public/images/footer
  href: string;
  alt: string;
}

export interface InstaImage {
  src: string; // path to Instagram preview image
  alt: string;
}
