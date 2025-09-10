export interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: File | null | undefined;
  error?: { message?: string  } | undefined;
  className?: string
}