import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildProductJsonLd } from "@/src/constants/structuredData";
import StandardBuilderContainer from "@/src/containers/standard-builder/dimensions";

export const metadata = buildPublicMetadata(routes.STANDARD);

const productJsonLd = buildProductJsonLd({
  name: "Custom 3D Coin — Standard Builder",
  description: routes.STANDARD.description,
  path: routes.STANDARD.path,
});

export default function StandardBuilderPage() {
  return (
    <>
      <JsonLd data={productJsonLd} />
      <StandardBuilderContainer />
    </>
  );
}
