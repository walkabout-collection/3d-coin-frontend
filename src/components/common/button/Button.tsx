import React from "react";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  type = "button",
  width = "w-full",
  height = "",
  variant = "primary",
  textColor = "text-white",
  bgColor = "bg-primary",
  borderColor = "border-primary",
  fontWeight = "font-medium",
  padding = "px-6 py-4",
  radius = "rounded-full",
  children,
  onClick,
  disabled = false,
  className = "",
  shadow = "shadow-md",
  style,
}) => {
  const baseStyles = `${textColor} ${padding} ${fontWeight} ${width} ${height} ${radius} flex justify-center items-center transition-all duration-300 ease-out ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`;

  const variantStyles = {
    primary: `${baseStyles} ${bgColor} ${shadow} bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark`,
    secondary: `${baseStyles} bg-white ${textColor} border border-primary ${shadow} hover:bg-gray-100`,
    ternary: `${baseStyles} bg-ternary-light ${textColor} ${shadow} hover:bg-ternary-light`,
    outline: `${baseStyles} border-2 ${borderColor} bg-transparent ${textColor} ${shadow} hover:bg-primary/10`,
  };

  return (
    <button
      className={variantStyles[variant]}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;