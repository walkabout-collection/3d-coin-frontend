export interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile_picture: File | null;
}

export interface SignupProps {
  onSignupSuccess?: () => void;
  onSignupError?: (error: string) => void;
}