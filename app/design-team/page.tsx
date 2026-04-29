import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";

export const metadata = buildPublicMetadata(routes.DESIGN_TEAM);

export { default } from "@/src/containers/design-team";
