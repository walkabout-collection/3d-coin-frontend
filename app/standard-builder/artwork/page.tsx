import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/src/constants/structuredData";
import ArtworkContainer from "@/src/containers/standard-builder/art-work";

export const metadata = buildPublicMetadata(routes.ARTWORK);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Standard Builder", path: routes.STANDARD.path },
  { name: routes.ARTWORK.title, path: routes.ARTWORK.path },
]);

export default function ArtworkPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <ArtworkContainer />
    </>
  );
}
