import { forwardRef } from "react";
import { InputProps } from "./types";

const Input = forwardRef<HTMLInputElement, InputProps>(
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
      bg = "bg-[#f4f6fa]",
      ...props
    },
    ref
  ) => {
    // Base styles: white background, no rounding by default, full width
    const baseStyles = `w-full font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      rounded ? "rounded-full" : "rounded-none"
    } bg-${bg} border border-gray-300`; 

    // Variant-specific styles
    const variantStyles = {
      primary: "bg-white text-gray-900 hover:bg-gray-500",
      secondary: "bg-transparent border-primary text-gray-900 hover:bg-gray-50",
      outline: "bg-transparent border-primary text-gray-900 hover:border-blue-500",
    };

    // Size-specific styles
    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-4 text-sm", // Adjusted padding to match image height
      lg: "px-5 py-4 text-lg",
    };

    // Combine all styles
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
          <label className="block mb-2 text-sm font-normal text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={combinedStyles}
          placeholder={placeholder}
          {...(register
            ? (() => {
                const { ref: _registerRef, ...rest } = register;
                return rest;
              })()
            : {})}
          {...props}
        />
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