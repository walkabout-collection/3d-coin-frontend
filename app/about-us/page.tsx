import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.ABOUT_US);

export { default } from "@/src/containers/about-us";
