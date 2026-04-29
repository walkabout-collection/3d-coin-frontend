import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.STANDARD);

export { default } from "@/src/containers/standard-builder/dimensions";
