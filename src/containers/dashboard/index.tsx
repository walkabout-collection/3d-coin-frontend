import React from "react";
import Image from "next/image";
import { dashboardCards } from "./data";
import { DashboardProps } from "./types";

export default function Dashboard({ cards = dashboardCards }: DashboardProps) {
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Welcome!</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1a2a3a] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <div className="w-6 h-6 relative">
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {card.title}
                </h2>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
