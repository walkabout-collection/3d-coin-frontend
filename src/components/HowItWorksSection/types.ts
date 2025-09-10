export interface HowItWorksStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  iconName: string;
}

export interface HowItWorksData {
  steps: HowItWorksStep[];
}