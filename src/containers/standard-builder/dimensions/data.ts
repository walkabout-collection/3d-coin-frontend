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
    id: "dimensions",
    title: "DIMENSIONS",
    icon: "ruler",
    completed: false,
    active: true,
    path: "/standard-builder",
  },
  {
    id: "material",
    title: "MATERIAL",
    icon: "layers",
    completed: false,
    active: false,
    path: "/standard-builder/material",
  },
  {
    id: "edge-type",
    title: "EDGE TYPE",
    icon: "square",
    completed: false,
    active: false,
    path: "/standard-builder/edge-type",
  },
  {
    id: "text-rings",
    title: "TEXT RINGS",
    icon: "type",
    completed: false,
    active: false,
    path: "/standard-builder/text-rings",
  },
  {
    id: "artwork",
    title: "ARTWORK",
    icon: "palette",
    completed: false,
    active: false,
    path: "/standard-builder/artwork",
  },
];

// export const updateStepsBasedOnPath = (currentPath: string, allSteps: Step[]): Step[] => {
//   const currentStepIndex = allSteps.findIndex(step => step.path === currentPath);

//   if (currentStepIndex === -1) return allSteps;

//   return allSteps.map((step, index) => {
//     if (index < currentStepIndex) {
//       return { ...step, completed: true, active: false };
//     }

//     if (index === currentStepIndex) {
//       return { ...step, active: true, completed: false };
//     }

//     return { ...step, active: false, completed: false };
//   });
// };
export const updateStepsBasedOnPath = (
  currentPath: string,
  allSteps: Step[],
): Step[] => {
  if (
    currentPath === "/standard-builder/confirm-packaging" ||
    currentPath === "/standard-builder/packaging"
  ) {
    return allSteps.map((step) => ({
      ...step,
      completed: true,
      active: false,
    }));
  }

  const currentStepIndex = allSteps.findIndex(
    (step) => step.path === currentPath,
  );

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
// Diameter is displayed in inches per design feedback. The `value` field
// still stores the millimeter equivalent so the 3D viewer's existing
// `parseDimension` logic (which extracts a number from the string) keeps
// working without touching ModularCoin scaling.
export const coinDiameters = [
  { value: "15.24mm", label: "0.6 in" },
  { value: "17.78mm", label: "0.7 in" },
  { value: "20.32mm", label: "0.8 in" },
  { value: "22.86mm", label: "0.9 in" },
  { value: "25.4mm", label: "1 in" },
];

// Thickness stays in millimeters per design feedback.
export const coinThicknesses = [
  { value: "1.5mm", label: "1.5 mm" },
  { value: "2.0mm", label: "2.0 mm" },
  { value: "2.5mm", label: "2.5 mm" },
];

// Map a stored diameter value (e.g. "25.4mm") back to its user-facing inch
// label (e.g. "1 in"). Used by display surfaces like the design summary so
// the customer sees inches everywhere, not the underlying mm value.
export const formatDiameterLabel = (
  value: string | undefined | null,
): string => {
  if (!value) return "N/A";
  const match = coinDiameters.find((opt) => opt.value === value);
  return match ? match.label : value;
};
