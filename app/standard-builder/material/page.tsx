import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.MATERIAL);

export { default } from "@/src/containers/standard-builder/material";
