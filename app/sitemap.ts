import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.legacyforgecoins.com";

const PUBLIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact-us", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.7 },
  { path: "/design-team", changeFrequency: "monthly", priority: 0.8 },
  { path: "/custom-shapes", changeFrequency: "monthly", priority: 0.9 },
  { path: "/standard-builder", changeFrequency: "monthly", priority: 0.9 },
  {
    path: "/standard-builder/material",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/standard-builder/edge-type",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/standard-builder/text-rings",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/standard-builder/artwork",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/standard-builder/packaging",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/standard-builder/confirm-packaging",
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
