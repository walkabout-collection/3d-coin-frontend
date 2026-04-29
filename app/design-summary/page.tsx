import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.DESIGN_SUMMARY);

export { default } from "@/src/containers/design-summary";
