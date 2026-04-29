import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/src/constants/structuredData";
import MaterialContainer from "@/src/containers/standard-builder/material";

export const metadata = buildPublicMetadata(routes.MATERIAL);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Standard Builder", path: routes.STANDARD.path },
  { name: routes.MATERIAL.title, path: routes.MATERIAL.path },
]);

export default function MaterialPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <MaterialContainer />
    </>
  );
}
