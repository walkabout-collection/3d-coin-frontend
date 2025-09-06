import { InputHTMLAttributes, RefAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    RefAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary" | "outline";
  inputSize?: "sm" | "md" | "lg";
  className?: string;
  error?: string | string[]; 
  register?: UseFormRegisterReturn; 
  label?: string; 
  required?: boolean; 
  placeholder?: string; 
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupProps {
  onSignupSuccess?: () => void;
  onSignupError?: (error: string) => void;
}