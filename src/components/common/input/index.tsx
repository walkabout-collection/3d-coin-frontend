"use client";
import { forwardRef } from "react";
import { InputProps } from "./types";
import Image from "next/image";

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(
  (
    {
      variant = "primary",
      inputSize = "md",
      className = "",
      error,
      register,
      label,
      placeholder = "",
      rounded = false,
      bg = "bg-gray-100",
      textarea = false,
      select = false,
      options = [],
      rows = 3,
      labelClassName = "",
      ...props
    },
    ref
  ) => {
    const effectiveBg = bg === "" || bg === "bg-transparent" ? "" : bg;

    const baseStyles = `
      w-full font-medium text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500
      focus:border-transparent transition-colors
      ${rounded ? "rounded-full" : "rounded-md"}
      border border-gray-300
      appearance-none
      ${effectiveBg}
    `;

    const variantStyles = {
      primary: "text-gray-900",
      secondary: "border-primary text-gray-900 hover:bg-gray-50",
      outline: "border-primary text-gray-900 hover:border-blue-500",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const combinedStyles = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[inputSize],
      className,
      error ? "border-red-500" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="mb-4">
        {label && (
          <label
            className={`block mb-2 text-sm font-normal text-gray-700 ${labelClassName}`}
          >
            {label}
          </label>
        )}

        {select ? (
          <div className="relative">
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              className={`${combinedStyles} pr-14`}
              {...register}
              {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              {placeholder && (
                <option value="" disabled selected>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Image
              src="/images/home/select-icon.svg"
              alt="Select Icon"
              width={13}
              height={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        ) : textarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={combinedStyles}
            placeholder={placeholder}
            rows={rows}
            {...register}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={combinedStyles}
            placeholder={placeholder}
            {...register}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <div className="mt-1 text-red-500 text-sm">
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
