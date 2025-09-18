// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Input from "@/src/components/common/input";
// import Button from "@/src/components/common/button/Button";
// import { coinDiameterOptions, coinThicknessOptions } from "./data";

// const Dimensions = () => {
//   const [coinDiameter, setCoinDiameter] = useState("");
//   const [coinThickness, setCoinThickness] = useState("");
//   const router = useRouter();

//   const handleContinue = () => {
//     if (coinDiameter && coinThickness) {
//       const dimensionsData = {
//         "standard-builder": {
//           dimensions: {
//             "coin-diameter": coinDiameter,
//             "coin-thickness": coinThickness,
//           },
//         },
//       };

//       console.log(JSON.stringify(dimensionsData, null, 2));
//       localStorage.setItem(
//         "standard-builder-data",
//         JSON.stringify(dimensionsData)
//       );
//       router.push("/standard-builder/material");
//     } else {
//       // alert('Please select both coin diameter and coin thickness.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-row items-start justify-center py-10 ">
//       <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
//         <div className="flex flex-col items-center">
//           <Image
//             src="/images/home/coin-design.png"
//             alt="Coin"
//             width={335}
//             height={335}
//             className="z-10"
//           />
//           <Image
//             src="/images/home/frame.png"
//             alt="Coin Base"
//             width={494}
//             height={143}
//             className="mt-[-50px] z-0"
//           />
//         </div>
//       </div>

//       {/* Right Side - Form Container */}
//       <div className="flex flex-col">
//         <h1 className="text-xl font-semibold text-gray-900  mb-6">
//           Select Your Coin Dimensions
//         </h1>
//         <div className="w-full max-w-md p-6 te rounded-lg shadow-md">
//           <div>
//             <h3 className="text-md font-bold text-gray-800 mb-4">
//               Coin Diameter
//             </h3>
//             <Input
//               select
//               options={coinDiameterOptions}
//               placeholder="Select Coin Diameter"
//               inputSize="md"
//               className="border-none py-3 px-6 rounded-xl"
//               bg="bg-gray-100"
//               value={coinDiameter}
//               onChange={(e) => setCoinDiameter(e.target.value)}
//             />
//           </div>

//           <div className="mt-6">
//             <h3 className="text-md font-bold text-gray-800 mb-4">
//               Coin Thickness
//             </h3>
//             <Input
//               select
//               options={coinThicknessOptions}
//               placeholder="Select Coin Thickness"
//               inputSize="md"
//               className="border-none py-3 px-6 rounded-xl"
//               bg="bg-gray-100"
//               value={coinThickness}
//               onChange={(e) => setCoinThickness(e.target.value)}
//             />
//           </div>

//           <p className="text-gray-600 mb-6 mt-4">
//             Our 3D Builder may have limitations that our design team can address
//             after submission. All designs can be submitted to design team for
//             rework/revisions.
//           </p>
//         </div>
//         <Button
//           variant="primary"
//           onClick={handleContinue}
//           className="mt-8 w-full max-w-[180px] text-lg font-medium shadow-md hover:shadow-lg transition-shadow mx-auto"
//           disabled={!coinDiameter || !coinThickness}
//         >
//           Continue
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Dimensions;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "@/src/components/common/input";
import Button from "@/src/components/common/button/Button";
import { fetchDimensionOptions, saveDimensions } from "./data";

const Dimensions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [coinDiameter, setCoinDiameter] = useState("");
  const [coinThickness, setCoinThickness] = useState("");

  const {
    data: options,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dimensionOptions"],
    queryFn: fetchDimensionOptions,
  });

const mutation = useMutation({
  mutationFn: saveDimensions,
  onSuccess: (data) => {
    const dimensionsData = {
      "standard-builder": {
        dimensions: {
          "coin-diameter": data.coinDiameter,
          "coin-thickness": data.coinThickness,
        },
      },
    };

    console.log(JSON.stringify(dimensionsData, null, 2));

    const existingData = JSON.parse(localStorage.getItem("standard-builder-data") || "{}");
    localStorage.setItem(
      "standard-builder-data",
      JSON.stringify({
        ...existingData,
        ...dimensionsData,
      })
    );

    router.push("/standard-builder/material");
  },
});

  const handleContinue = () => {
    if (coinDiameter && coinThickness) {
      mutation.mutate({ coinDiameter, coinThickness });
    }
  };

  if (isLoading) return <div>Loading options...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-10 ">
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center">
          <Image
            src="/images/home/coin-design.png"
            alt="Coin"
            width={335}
            height={335}
            className="z-10"
          />
          <Image
            src="/images/home/frame.png"
            alt="Coin Base"
            width={494}
            height={143}
            className="mt-[-50px] z-0"
          />
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900  mb-6">
          Select Your Coin Dimensions
        </h1>
        <div className="w-full max-w-md p-6 rounded-lg shadow-md">
          <div>
            <h3 className="text-md font-bold text-gray-800 mb-4">
              Coin Diameter
            </h3>
            <Input
              select
              options={options?.coinDiameters || []}
              placeholder="Select Coin Diameter"
              inputSize="md"
              className="border-none py-3 px-6 rounded-xl"
              bg="bg-gray-100"
              value={coinDiameter}
              onChange={(e) => setCoinDiameter(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-gray-800 mb-4">
              Coin Thickness
            </h3>
            <Input
              select
              options={options?.coinThicknesses || []}
              placeholder="Select Coin Thickness"
              inputSize="md"
              className="border-none py-3 px-6 rounded-xl"
              bg="bg-gray-100"
              value={coinThickness}
              onChange={(e) => setCoinThickness(e.target.value)}
            />
          </div>

          <p className="text-gray-600 mb-6 mt-4">
            Our 3D Builder may have limitations that our design team can address
            after submission. All designs can be submitted to design team for
            rework/revisions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleContinue}
          className="mt-8 w-full max-w-[180px] text-lg font-medium shadow-md hover:shadow-lg transition-shadow mx-auto"
          disabled={!coinDiameter || !coinThickness || mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Dimensions;
