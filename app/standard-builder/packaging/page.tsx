import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/src/constants/structuredData";
import PackagingContainer from "@/src/containers/standard-builder/packaging";

export const metadata = buildPublicMetadata(routes.PACKAGING);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Standard Builder", path: routes.STANDARD.path },
  { name: routes.PACKAGING.title, path: routes.PACKAGING.path },
]);

export default function PackagingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PackagingContainer />
    </>
  );
}
