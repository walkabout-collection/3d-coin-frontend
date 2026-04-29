import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.SERVICES);

export { default } from "@/src/containers/services";
