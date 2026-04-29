import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/src/constants/structuredData";
import EdgeTypeContainer from "@/src/containers/standard-builder/edge-type";

export const metadata = buildPublicMetadata(routes.EDGE_TYPE);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Standard Builder", path: routes.STANDARD.path },
  { name: routes.EDGE_TYPE.title, path: routes.EDGE_TYPE.path },
]);

export default function EdgeTypePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <EdgeTypeContainer />
    </>
  );
}
