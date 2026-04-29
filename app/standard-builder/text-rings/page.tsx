import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/src/constants/structuredData";
import TextRingsContainer from "@/src/containers/standard-builder/text-rings";

export const metadata = buildPublicMetadata(routes.TEXT_RINGS);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Standard Builder", path: routes.STANDARD.path },
  { name: routes.TEXT_RINGS.title, path: routes.TEXT_RINGS.path },
]);

export default function TextRingsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <TextRingsContainer />
    </>
  );
}
