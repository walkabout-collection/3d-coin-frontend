import type { Metadata } from "next";

export const DEFAULT_OG_IMAGE = "/images/HeroCoin.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const SITE_NAME = "Legacy Forge";

type PublicRouteEntry = {
  metaTitle: string;
  description: string;
  path: string;
  ogImage?: string;
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    image?: string;
  };
};

export function buildPublicMetadata(route: PublicRouteEntry): Metadata {
  const ogImage = route.ogImage ?? DEFAULT_OG_IMAGE;
  const twitterImage = route.twitter?.image ?? ogImage;
  const twitterTitle = route.twitter?.title ?? route.metaTitle;
  const twitterDescription = route.twitter?.description ?? route.description;

  return {
    title: route.metaTitle,
    description: route.description,
    alternates: {
      canonical: route.path,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: route.path,
      title: route.metaTitle,
      description: route.description,
      images: [
        {
          url: ogImage,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: route.metaTitle,
        },
      ],
    },
    twitter: {
      card: route.twitter?.card ?? "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
    },
  };
}
