export interface Step {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  active: boolean;
  path: string;
}

export const initialSteps: Step[] = [
  {
    id: 'dimensions',
    title: 'DIMENSIONS',
    icon: 'ruler',
    completed: false,
    active: true,
    path: '/standard-builder'
  },
  {
    id: 'material',
    title: 'MATERIAL',
    icon: 'layers',
    completed: false,
    active: false,
    path: '/standard-builder/material'
  },
  {
    id: 'edge-type',
    title: 'EDGE TYPE',
    icon: 'square',
    completed: false,
    active: false,
    path: '/standard-builder/edge-type'
  },
  {
    id: 'text-rings',
    title: 'TEXT RINGS',
    icon: 'type',
    completed: false,
    active: false,
    path: '/standard-builder/text-rings'
  },
  {
    id: 'artwork',
    title: 'ARTWORK',
    icon: 'palette',
    completed: false,
    active: false,
    path: '/standard-builder/artwork'
  }
];

export const updateStepsBasedOnPath = (currentPath: string, allSteps: Step[]): Step[] => {
  const currentStepIndex = allSteps.findIndex(step => step.path === currentPath);
  
  if (currentStepIndex === -1) return allSteps;
  
  return allSteps.map((step, index) => {
    if (index < currentStepIndex) {
      return { ...step, completed: true, active: false };
    }
    
    if (index === currentStepIndex) {
      return { ...step, active: true, completed: false };
    }
    
    return { ...step, active: false, completed: false };
  });
};


// Static options
export const coinDiameterOptions = [
  { value: '17mm', label: '17mm' },
  { value: '20mm', label: '20mm' },
  { value: '25mm', label: '25mm' },
];

export const coinThicknessOptions = [
  { value: '1.5mm', label: '1.5mm' },
  { value: '2.0mm', label: '2.0mm' },
  { value: '2.5mm', label: '2.5mm' },
];

// Mock API fetch
export const fetchDimensionOptions = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return { coinDiameters: coinDiameterOptions, coinThicknesses: coinThicknessOptions };
};

// Mock API save
export const saveDimensions = async (data: { coinDiameter: string; coinThickness: string }) => {
  await new Promise((r) => setTimeout(r, 500));
  return data;
};
