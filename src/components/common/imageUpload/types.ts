export interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: File | null;
  error?: { message?: string };
}