import HeroSection from "@/src/components/HomePageHero/HeroSection";
import { heroSectionData, pricingData } from "./data";

export default function Pricing() {
  return (
    <main>
      <HeroSection data={heroSectionData} />

      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          AFFORDABLE PRICING PLANS
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Lorem ipsum dolor sit amet consectetur adipiscing elit tortor eu
          egestas morbi sem vulputate etiam facilisis pellentesque ut quis.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm md:text-base">
                <th className="py-4 px-4 font-semibold">Dimensions</th>
                <th className="py-4 px-4 font-semibold">Material</th>
                <th className="py-4 px-4 font-semibold">Edge Type</th>
                <th className="py-4 px-4 font-semibold">Text Rings</th>
                <th className="py-4 px-4 font-semibold">Artwork</th>
                <th className="py-4 px-4 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody className="">
              {pricingData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-[#f4f6fa]" : "bg-white"
                  } text-sm md:text-base`}
                >
                  <td className="py-4 px-4">{item.dimensions}</td>
                  <td className="py-4 px-4 uppercase">{item.material}</td>
                  <td className="py-4 px-4 capitalize">{item.edge}</td>
                  <td className="py-4 px-4 capitalize">{item.textRings}</td>
                  <td className="py-4 px-4 capitalize">{item.artwork}</td>
                  <td className="py-4 px-4 font-medium">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
