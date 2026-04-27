"use client";
import React, { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/button/Button";
import {
  GuidedOption,
  GuidedSelection,
  composePrompt,
  purposeOptions,
  styleOptions,
  symbolOptions,
} from "./guidedBuilderData";

interface GuidedPromptBuilderProps {
  onComplete: (prompt: string) => void;
  onSwitchToAdvanced: () => void;
}

const STEP_TITLES = [
  "What's this coin for?",
  "Pick a style",
  "Choose a central symbol",
  "Add text to engrave",
];

const GuidedPromptBuilder: React.FC<GuidedPromptBuilderProps> = ({
  onComplete,
  onSwitchToAdvanced,
}) => {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<GuidedSelection>({
    purpose: null,
    style: null,
    symbol: null,
    text: "",
  });

  const composedPrompt = useMemo(() => composePrompt(selection), [selection]);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return !!selection.purpose;
      case 1:
        return !!selection.style;
      case 2:
        return !!selection.symbol;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, selection]);

  const isLastStep = step === STEP_TITLES.length - 1;

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLastStep) {
      onComplete(composedPrompt);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const renderOptionGrid = (
    options: GuidedOption[],
    selected: string | null,
    onSelect: (value: string) => void,
  ) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              isActive
                ? "border-[#FFD700] bg-gradient-to-br from-[#FFF9E6] to-white shadow-md"
                : "border-gray-200 bg-white hover:border-[#FFD700]/60 hover:bg-yellow-50/40"
            }`}
          >
            {isActive && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#193359] flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </span>
            )}
            {opt.icon && (
              <div className="text-2xl mb-2" aria-hidden="true">
                {opt.icon}
              </div>
            )}
            <div className="font-semibold text-sm text-gray-900">
              {opt.label}
            </div>
            {opt.description && (
              <div className="text-xs text-gray-500 mt-0.5 leading-snug">
                {opt.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto border-2 border-yellow-400 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Header: Progress */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#193359] tracking-wide uppercase">
            Guided Builder · Step {step + 1} of {STEP_TITLES.length}
          </span>
          <button
            type="button"
            onClick={onSwitchToAdvanced}
            className="text-xs font-medium text-gray-500 hover:text-[#193359] cursor-pointer transition-colors"
          >
            Write your own prompt →
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {STEP_TITLES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FFC300]"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <h3 className="mt-4 text-xl font-serif text-gray-900">
          {STEP_TITLES[step]}
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 py-6 min-h-[280px]">
        {step === 0 &&
          renderOptionGrid(purposeOptions, selection.purpose, (value) =>
            setSelection((s) => ({ ...s, purpose: value })),
          )}

        {step === 1 &&
          renderOptionGrid(styleOptions, selection.style, (value) =>
            setSelection((s) => ({ ...s, style: value })),
          )}

        {step === 2 &&
          renderOptionGrid(symbolOptions, selection.symbol, (value) =>
            setSelection((s) => ({ ...s, symbol: value })),
          )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to engrave{" "}
                <span className="text-gray-400 font-normal">
                  (optional — e.g. a motto, name, or date)
                </span>
              </label>
              <input
                type="text"
                value={selection.text}
                onChange={(e) =>
                  setSelection((s) => ({ ...s, text: e.target.value }))
                }
                maxLength={80}
                placeholder="HONOR · COURAGE · 2026"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#FFD700] transition-colors text-gray-800"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {selection.text.length}/80
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-lg bg-[#F7F9FC] border border-gray-200 p-4">
              <div className="text-xs font-semibold text-[#193359] uppercase tracking-wide mb-2">
                Your prompt preview
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {composedPrompt}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Nav */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
            step === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-[#193359] cursor-pointer"
          }`}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <Button
          onClick={handleNext}
          disabled={!canAdvance}
          variant="primary"
          width="w-auto"
          className="!px-6 !py-2.5 !text-sm flex items-center gap-1"
        >
          {isLastStep ? "Generate My Coin" : "Next"}
          {!isLastStep && <ChevronRight size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default GuidedPromptBuilder;
