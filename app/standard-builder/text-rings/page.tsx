import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.TEXT_RINGS);

export { default } from "@/src/containers/standard-builder/text-rings";
