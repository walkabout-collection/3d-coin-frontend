import type { Metadata } from "next";

export const DEFAULT_OG_IMAGE = "/images/HeroCoin.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const SITE_NAME = "Legacy Forge";
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.legacyforgecoins.com";

const absolute = (path: string) =>
  path.startsWith("http") ? path : new URL(path, SITE_URL).toString();

type OgType = "website" | "article" | "profile";

type PublicRouteEntry = {
  metaTitle: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: OgType;
  noindex?: boolean;
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    image?: string;
  };
};

const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
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
      canonical: absolute(route.path),
    },
    openGraph: {
      type: route.ogType ?? "website",
      siteName: SITE_NAME,
      url: absolute(route.path),
      title: route.metaTitle,
      description: route.description,
      images: [
        {
          url: absolute(ogImage),
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
      ...(TWITTER_HANDLE
        ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE }
        : {}),
    },
    ...(route.noindex ? { robots: NOINDEX_ROBOTS } : {}),
  };
}
