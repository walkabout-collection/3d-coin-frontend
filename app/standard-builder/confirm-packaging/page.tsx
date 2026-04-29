import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.CONFIRM_PACKAGING);

export { default } from "@/src/containers/standard-builder/confirm-packaging";
