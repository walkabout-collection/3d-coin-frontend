"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import Input from "@/src/components/common/input";

const TextRings = () => {
  const [activeTab, setActiveTab] = useState("front");
  const [frontTopText, setFrontTopText] = useState("");
  const [frontBottomText, setFrontBottomText] = useState("");
  const [backTopText, setBackTopText] = useState("");
  const [backBottomText, setBackBottomText] = useState("");
  const [frontNoText, setFrontNoText] = useState(false);
  const [backNoText, setBackNoText] = useState(false);

  const router = useRouter();

  const handleContinue = () => {
    const existingData = localStorage.getItem("standard-builder-data");
    const builderData = existingData ? JSON.parse(existingData) : {};

    const textRingsData = {
      ...builderData,
      "standard-builder": {
        ...builderData["standard-builder"],
        "text-rings": {
          front: {
            top: frontNoText ? "" : frontTopText,
            bottom: frontNoText ? "" : frontBottomText,
            noText: frontNoText,
          },
          back: {
            top: backNoText ? "" : backTopText,
            bottom: backNoText ? "" : backBottomText,
            noText: backNoText,
          },
        },
      },
    };

    console.log(JSON.stringify(textRingsData, null, 2));
    localStorage.setItem(
      "standard-builder-data",
      JSON.stringify(textRingsData)
    );
    router.push("/standard-builder/artwork");
  };

  const handleGoBack = () => {
    router.push("/standard-builder/edge-type");
  };

  const handleFrontNoTextChange = (checked: boolean) => {
    setFrontNoText(checked);
    if (checked) {
      setFrontTopText("");
      setFrontBottomText("");
    }
  };

  const handleBackNoTextChange = (checked: boolean) => {
    setBackNoText(checked);
    if (checked) {
      setBackTopText("");
      setBackBottomText("");
    }
  };

  const canContinue = () => {
    return (
      frontNoText ||
      frontTopText ||
      frontBottomText ||
      backNoText ||
      backTopText ||
      backBottomText
    );
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - Coin Image */}
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

      {/* Right Side - Text Rings */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          United State Air Force Coin
        </h1>

        <div className="w-full max-w-md p-6 rounded-lg shadow-md">
          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("front")}
              className={`
                py-3 px-6 text-sm font-semibold uppercase tracking-wide transition-colors duration-200
                ${
                  activeTab === "front"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Front Text
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`
                py-3 px-6 text-sm font-semibold uppercase tracking-wide transition-colors duration-200
                ${
                  activeTab === "back"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Back Text
            </button>
          </div>

          {/* Front Text Form */}
          {activeTab === "front" && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Top
                </label>
                <Input
                  placeholder="Type Your Text Here..."
                  inputSize="md"
                  className="border-none py-3 px-6 rounded-xl"
                  bg="bg-gray-100"
                  value={frontTopText}
                  onChange={(e) => setFrontTopText(e.target.value)}
                  disabled={frontNoText}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Bottom
                </label>
                <Input
                  placeholder="Type Your Text Here..."
                  inputSize="md"
                  className="border-none py-3 px-6 rounded-xl"
                  bg="bg-gray-100"
                  value={frontBottomText}
                  onChange={(e) => setFrontBottomText(e.target.value)}
                  disabled={frontNoText}
                />
              </div>

              {/* Front Checkbox */}
              <div className="mb-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={frontNoText}
                    onChange={(e) => handleFrontNoTextChange(e.target.checked)}
                    disabled={!!frontTopText.trim() || !!frontBottomText.trim()}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    Only Image (No Text or Text Embedded Into Image)
                  </span>
                </label>
              </div>

              {/* Validation Message */}
              {(!!frontTopText.trim() || !!frontBottomText.trim()) && (
                <p className="text-xs text-blue-800 mb-4">
                  You can either enter text OR select &quot;Only Image&quot;,
                  not both.
                </p>
              )}
              {frontNoText && (
                <p className="text-xs text-blue-800 mb-4">
                  &quot;Only Image&quot; selected — text inputs are disabled.
                </p>
              )}
            </div>
          )}

          {/* Back Text Form */}
          {activeTab === "back" && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Top
                </label>
                <Input
                  placeholder="Type Your Text Here..."
                  inputSize="md"
                  className="border-none py-3 px-6 rounded-xl"
                  bg="bg-gray-100"
                  value={backTopText}
                  onChange={(e) => setBackTopText(e.target.value)}
                  disabled={backNoText}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Bottom
                </label>
                <Input
                  placeholder="Type Your Text Here..."
                  inputSize="md"
                  className="border-none py-3 px-6 rounded-xl"
                  bg="bg-gray-100"
                  value={backBottomText}
                  onChange={(e) => setBackBottomText(e.target.value)}
                  disabled={backNoText}
                />
              </div>

              {/* Back Checkbox */}
              <div className="mb-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={backNoText}
                    onChange={(e) => handleBackNoTextChange(e.target.checked)}
                    disabled={!!backTopText.trim() || !!backBottomText.trim()}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    Only Image (No Text or Text Embedded Into Image)
                  </span>
                </label>
              </div>

              {/* Validation Message */}
              {(!!backTopText.trim() || !!backBottomText.trim()) && (
                <p className="text-xs text-blue-800 mb-4">
                  You can either enter text OR select &quot;Only Image&quot;,
                  not both.
                </p>
              )}
              {backNoText && (
                <p className="text-xs text-blue-800 mb-4">
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
