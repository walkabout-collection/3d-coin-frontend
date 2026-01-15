"use client";
import { forwardRef, useState } from "react";
import { InputProps } from "./types";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

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
      type === "password" ? "pr-12" : "", // extra space for eye icon
    ]
      .filter(Boolean)
      .join(" ");

    // Determine input type for rendering
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="mb-4 relative">
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
              {...(!register && { defaultValue: "" })}
              {...register}
              {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              {placeholder && (
                <option value="" disabled>
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
          <div className="relative">
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={combinedStyles}
              placeholder={placeholder}
              type={inputType}
              {...register}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="mt-1 text-red-500 text-sm">
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
