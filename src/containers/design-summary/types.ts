export interface DesignOption {
  id: number;
  label: string;
  value: string;
  type: 'size' | 'material' | 'edge' | 'text' | 'artwork';
  image: string;
}

export interface BottomButton {
  id: number;
  label: string;
  active: boolean;
}

export interface DesignSummaryProps {
  onSaveDraft?: () => void;
  onSubmitQuote?: () => void;
}