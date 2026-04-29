const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.legacyforgecoins.com";

const absolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Legacy Forge",
  url: SITE_URL,
  logo: absolute("/images/HeroCoin.png"),
  description:
    "Legacy Forge designs and manufactures custom 3D coins. Build your coin online with our 3D builder or work directly with our design team.",
  sameAs: [],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Legacy Forge",
  url: SITE_URL,
  inLanguage: "en-US",
};

export type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

type ProductInput = {
  name: string;
  description: string;
  image?: string;
  path: string;
  brand?: string;
  priceCurrency?: string;
  lowPrice?: string | number;
  highPrice?: string | number;
};

export function buildProductJsonLd(p: ProductInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: absolute(p.image ?? "/images/HeroCoin.png"),
    url: absolute(p.path),
    brand: {
      "@type": "Brand",
      name: p.brand ?? "Legacy Forge",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: p.priceCurrency ?? "USD",
      ...(p.lowPrice !== undefined ? { lowPrice: p.lowPrice } : {}),
      ...(p.highPrice !== undefined ? { highPrice: p.highPrice } : {}),
      availability: "https://schema.org/InStock",
    },
  };
}
