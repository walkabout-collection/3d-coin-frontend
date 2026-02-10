"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import Input from "@/src/components/common/input";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import Coin3DViewer from "@/src/components/common/Coin3DViewer";

const TextRings = () => {
  const router = useRouter();
  const { textRings, setTextRings, material, dimensions, edgeType, artwork } =
    useStandardBuilderStore();

  const [activeTab, setActiveTab] = useState<"front" | "back">("front");

  const { front, back } = textRings;

  const handleFrontChange = (field: "top" | "bottom", value: string) => {
    setTextRings({
      ...textRings,
      front: { ...front, [field]: value },
    });
  };

  const handleBackChange = (field: "top" | "bottom", value: string) => {
    setTextRings({
      ...textRings,
      back: { ...back, [field]: value },
    });
  };

  const handleFrontNoText = (checked: boolean) => {
    setTextRings({
      ...textRings,
      front: {
        top: checked ? "" : front.top,
        bottom: checked ? "" : front.bottom,
        noText: checked,
      },
    });
  };

  const handleBackNoText = (checked: boolean) => {
    setTextRings({
      ...textRings,
      back: {
        top: checked ? "" : back.top,
        bottom: checked ? "" : back.bottom,
        noText: checked,
      },
    });
  };

  const canContinue = () => {
    return (
      front.noText ||
      front.top ||
      front.bottom ||
      back.noText ||
      back.top ||
      back.bottom
    );
  };

  const handleContinue = () => {
    console.log("Text Rings Saved:", textRings);
    router.push("/standard-builder/artwork");
  };

  const handleGoBack = () => {
    router.push("/standard-builder/edge-type");
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - 3D Coin Viewer */}
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center w-full">
          <div className="w-full h-[500px] relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-lg p-4">
            <Coin3DViewer
              materialId={material || "gold"}
              dimensions={dimensions}
              edgeType={edgeType}
              textRings={textRings}
              artwork={artwork}
              className="w-full h-full"
              autoRotate={true}
              enableControls={true}
            />
          </div>
        </div>
      </div>

      {/* Right Side - Text Rings */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          United State Air Force Coin
        </h1>

        <div className="w-full max-w-md p-6 rounded-lg shadow-md">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("front")}
              className={`py-3 px-6 text-sm font-semibold uppercase tracking-wide ${
                activeTab === "front"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Front Text
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`py-3 px-6 text-sm font-semibold uppercase tracking-wide ${
                activeTab === "back"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Back Text
            </button>
          </div>

          {/* Front Inputs */}
          {activeTab === "front" && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Top
              </label>
              <Input
                placeholder="Type Your Text Here..."
                inputSize="md"
                className="border-none py-3 px-6 rounded-xl"
                bg="bg-gray-100"
                value={front.top}
                onChange={(e) => handleFrontChange("top", e.target.value)}
                disabled={front.noText}
              />

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Bottom
                </label>
                <Input
                  placeholder="Type Your Text Here..."
                  inputSize="md"
                  className="border-none py-3 px-6 rounded-xl "
                  bg="bg-gray-100"
                  value={front.bottom}
                  onChange={(e) => handleFrontChange("bottom", e.target.value)}
                  disabled={front.noText}
                />
              </div>
              <label className="flex items-start space-x-3 ">
                <input
                  type="checkbox"
                  checked={front.noText}
                  onChange={(e) => handleFrontNoText(e.target.checked)}
                  disabled={!!front.top || !!front.bottom}
                  className="mt-1 w-4 h-4"
                />
                <span>Only Image (No Text or Text Embedded Into Image)</span>
              </label>
              {(!!front.top.trim() || !!front.bottom.trim()) &&
                front.noText && (
                  <p className="text-xs text-blue-600 mt-2">
                    You cannot enter text and select &quot;Only Image&quot;
                    together.
                  </p>
                )}
              {front.noText && !(front.top.trim() || front.bottom.trim()) && (
                <p className="text-xs text-blue-600 mt-2">
                  &quot;Only Image&quot; selected — text inputs are disabled.
                </p>
              )}
            </div>
          )}

          {/* Back Inputs */}
          {activeTab === "back" && (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Top
              </label>
              <Input
                placeholder="Type Your Text Here..."
                inputSize="md"
                className="border-none py-3 px-6 rounded-xl"
                bg="bg-gray-100"
                value={back.top}
                onChange={(e) => handleBackChange("top", e.target.value)}
                disabled={back.noText}
              />
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Bottom
                </label>
                <Input
                  placeholder="Type Your Text Here..."
                  inputSize="md"
                  className="border-none py-3 px-6 rounded-xl "
                  bg="bg-gray-100"
                  value={back.bottom}
                  onChange={(e) => handleBackChange("bottom", e.target.value)}
                  disabled={back.noText}
                />
              </div>
              <label className="flex items-start space-x-3 mt-2">
                <input
                  type="checkbox"
                  checked={back.noText}
                  onChange={(e) => handleBackNoText(e.target.checked)}
                  disabled={!!back.top || !!back.bottom}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Only Image (No Text or Text Embedded Into Image)
                </span>
              </label>

              {/* Validation Message */}
              {(!!back.top.trim() || !!back.bottom.trim()) && back.noText && (
                <p className="text-xs text-blue-600 mt-2">
                  You cannot enter text and select &quot;Only Image&quot;
                  together.
                </p>
              )}
              {back.noText && !(back.top.trim() || back.bottom.trim()) && (
                <p className="text-xs text-blue-600 mt-2">
                  &quot;Only Image&quot; selected — text inputs are disabled.
                </p>
              )}
            </div>
          )}

          <p className="text-gray-600 mb-6 mt-4">
            Our 3D Builder may have limitations that our design team can address
            after submission. All designs can be submitted to design team for
            rework/revisions.
          </p>
        </div>

        <div className="flex gap-4 mt-8 justify-between">
          <Button
            variant="ternary"
            onClick={handleGoBack}
            className="max-w-[140px] text-lg font-medium border-none !bg-gray-200 text-gray-900 hover:bg-gray-50"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={handleContinue}
            className="w-full max-w-[140px] text-lg font-medium shadow-md hover:shadow-lg transition-shadow"
            disabled={!canContinue()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextRings;
