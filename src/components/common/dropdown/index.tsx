"use client";
import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { DropdownProps } from "./types";

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  contentClassName = "",
  ariaLabel,
}) => {
  return (
    <Select.Root
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}
    >
      <Select.Trigger
        aria-label={ariaLabel || placeholder}
        className={[
          "w-full flex items-center justify-between",
          "bg-gray-100 rounded-xl px-6 py-3",
          "text-base font-medium text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "data-[placeholder]:text-gray-400",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "transition-colors",
          className,
        ].join(" ")}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-3 text-gray-500">
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className={[
            "z-50 overflow-hidden",
            "bg-white rounded-xl shadow-lg border border-gray-100",
            "min-w-[var(--radix-select-trigger-width)]",
            "max-h-[min(var(--radix-select-content-available-height),320px)]",
            "animate-in fade-in-0 zoom-in-95",
            contentClassName,
          ].join(" ")}
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={[
                  "relative flex items-center",
                  "px-6 py-3 rounded-lg cursor-pointer select-none",
                  "text-base text-gray-900",
                  "outline-none",
                  "data-[highlighted]:bg-gray-50",
                  "data-[state=checked]:bg-gray-50 data-[state=checked]:font-semibold",
                  "data-[disabled]:text-gray-300 data-[disabled]:cursor-not-allowed",
                ].join(" ")}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="ml-auto pl-3 text-gray-700">
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default Dropdown;
