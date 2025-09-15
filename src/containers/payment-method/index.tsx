"use client";
import { useState } from "react";
import Image from "next/image";
import { paymentOptions } from "./data";
import { PaymentOption } from "./types";

const PaymentMethod: React.FC = () => {
  const [selected, setSelected] = useState<string>("");

  const handleSelect = async (option: PaymentOption) => {
    setSelected(option.id);

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      const data = await res.json();
      console.log("Dummy API Response:", data);
    } catch (err) {
      console.error("Dummy API Error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
      <p className="text-gray-600 mb-6">Choose Payment Method Below</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleSelect(option)}
            className={`relative cursor-pointer  rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-gray-100 hover:bg-gray-100 transition 
              `}
          >
            <div className="absolute top-3 right-3">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center 
                //   ${selected === option.id ? "" : "border-gray-400"}`}
              >
                {selected === option.id && (
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-800"></span>
                )}
              </span>
            </div>

            <Image
              src={option.logo}
              alt={option.name}
              width={80}
              height={80}
              className="object-contain"
            />
            <p className="text-sm font-medium text-gray-700">{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
