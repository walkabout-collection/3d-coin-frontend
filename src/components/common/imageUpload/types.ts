export interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: File | null ;
  error?: string;
  className?: string;
  id: string;
}