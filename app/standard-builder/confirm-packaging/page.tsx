import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/src/constants/structuredData";
import ConfirmPackagingContainer from "@/src/containers/standard-builder/confirm-packaging";

export const metadata = buildPublicMetadata(routes.CONFIRM_PACKAGING);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Standard Builder", path: routes.STANDARD.path },
  { name: routes.CONFIRM_PACKAGING.title, path: routes.CONFIRM_PACKAGING.path },
]);

export default function ConfirmPackagingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <ConfirmPackagingContainer />
    </>
  );
}
