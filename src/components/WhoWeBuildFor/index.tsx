import { WhoWeBuildForCard } from "../common/whoWeBuildForCard";
import { whoWeBuildForData } from "./data";

export default function WhoWeBuildFor() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 items-center justify-center flex flex-col">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Who We Build For
          </h2>
          <p className="text-lg text-primary max-w-2xl mx-auto leading-relaxed">
            From personal milestones to professional recognition,
            <br />
            custom coins make moments unforgettable.
          </p>
        </div>
        <div className="max-w-7xl flex flex-wrap justify-center gap-6">
          {whoWeBuildForData.map((item, index) => (
            <WhoWeBuildForCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
