import { routes } from "@/src/constants/routes";
import { buildPublicMetadata } from "@/src/constants/seo";
import JsonLd from "@/src/components/common/seo/JsonLd";
import { buildProductJsonLd } from "@/src/constants/structuredData";
import CustomShapesContainer from "@/src/containers/custom-shapes";

export const metadata = buildPublicMetadata(routes.CUSTOM_SHAPES);

const productJsonLd = buildProductJsonLd({
  name: "Custom 3D Coin — AI Custom Shape Generator",
  description: routes.CUSTOM_SHAPES.description,
  path: routes.CUSTOM_SHAPES.path,
});

export default function CustomShapesPage() {
  return (
    <>
      <JsonLd data={productJsonLd} />
      <CustomShapesContainer />
    </>
  );
}
