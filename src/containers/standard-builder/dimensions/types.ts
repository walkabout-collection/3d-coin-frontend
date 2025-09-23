export interface Step {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  active: boolean;
  path: string; 
}

export interface DimensionData {
  coinDiameter: string;
  coinThickness: string;
}