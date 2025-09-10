import { Card } from "../common/card";
import { CardProps } from "../common/card/types";
import { cardsData } from "./data";

const CardSection = () => {
  return (
    <section className="py-16 px-4  min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Choose Your Design
          </h2>
          <h3 className="text-4xl font-bold text-gray-800 uppercase tracking-wider">
            Method
          </h3>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {cardsData.map((card: CardProps, index: number) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
