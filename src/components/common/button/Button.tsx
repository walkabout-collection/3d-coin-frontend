import React from "react";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  type = "button",
  width = "w-full",
  height = "",
  variant = "primary",
  children,
  onClick,
  disabled = false,
  className = "",
  style,
  href,
}) => {
  const baseStyles = `
    flex justify-center items-center
    px-6 py-3 font-semibold text-base
    rounded-full transition-all duration-300 ease-out cursor-pointer
    ${width} ${height}
    ${disabled ? "cursor-not-allowed opacity-50" : ""}
    ${className}
  `;

  const variantStyles: Record<string, string> = {
    primary: `
      ${baseStyles}
      text-white
      bg-gradient-to-r from-[#121C2A] via-[#193359] to-[#244978]
      shadow-[0_4px_12px_rgba(0,0,0,0.6)]
    `,
    secondary: `
      ${baseStyles}
      text-black
      bg-gradient-to-b from-[#FFD700] to-[#FFC300]
      shadow-[0_6px_12px_rgba(255,215,0,0.6)]
      hover:from-[#FFC300] hover:to-[#FFB700]
    `,
    ternary: `
      ${baseStyles}
      text-black bg-white border border-gray-300
      hover:bg-gray-100
      shadow-sm
    `,
  };

  if (href) {
    return (
      <a href={href} style={style} className={variantStyles[variant]}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={style}
      className={variantStyles[variant]}
    >
      {children}
    </button>
  );
};

export default Button;
