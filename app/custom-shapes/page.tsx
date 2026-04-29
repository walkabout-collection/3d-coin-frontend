import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.CUSTOM_SHAPES);

export { default } from "@/src/containers/custom-shapes";
