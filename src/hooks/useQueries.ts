import { useQuery, useMutation } from "@tanstack/react-query";
import { coinDiameters, coinThicknesses } from "../containers/standard-builder/dimensions/data";
import { DimensionData } from "../containers/standard-builder/dimensions/types";
// import { materials } from "../containers/standard-builder/materials/data";

// Dimensions
const fetchDimensionOptions = async () => {
  await new Promise((r) => setTimeout(r, 500)); 
  return {
    coinDiameters,
    coinThicknesses,
  };
};

const saveDimensions = async (data: DimensionData) => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    "coin-diameter": data.coinDiameter,
    "coin-thickness": data.coinThickness,
  };
};

export const useDimensionOptions = () =>
  useQuery({ queryKey: ["dimensionOptions"], queryFn: fetchDimensionOptions });


export const useSaveDimensions = (options?: any) =>
  useMutation<
    { "coin-diameter": string; "coin-thickness": string },
    Error,
    DimensionData
  >({
    mutationFn: saveDimensions,
    ...options,
  });

// Materials
const fetchMaterialOptions = async () => {
  await new Promise((r) => setTimeout(r, 500));
//   return materials;
};

const saveMaterial = async (materialId: string) => {
  await new Promise((r) => setTimeout(r, 500));
  return { materialId };
};

export const useMaterialOptions = () =>
  useQuery({ queryKey: ["materialOptions"], queryFn: fetchMaterialOptions });

export const useSaveMaterial = (options?: any) =>
  useMutation({ mutationFn: saveMaterial, ...options });




// import { useQuery, useMutation } from "@tanstack/react-query";
// import {
//   getDimensionOptions,
//   saveDimensions,
//   getMaterialOptions,
//   saveMaterial,
//   getUsers,
// } from "@/src/services/apiServices";
// import { Dimension, Material, User } from "@/src/services/apiTypes";

// // Dimensions
// export const useDimensionOptions = () =>
//   useQuery<Dimension[]>({ queryKey: ["dimensionOptions"], queryFn: getDimensionOptions });

// export const useSaveDimensions = (options?: any) =>
//   useMutation<Dimension, Error, Dimension>({
//     mutationFn: saveDimensions,
//     ...options,
//   });

// //  Materials
// export const useMaterialOptions = () =>
//   useQuery<Material[]>({ queryKey: ["materialOptions"], queryFn: getMaterialOptions });

// export const useSaveMaterial = (options?: any) =>
//   useMutation<Material, Error, string>({
//     mutationFn: saveMaterial,
//     ...options,
//   });

// Users
// export const useUsers = () =>
//   useQuery<User[]>({ queryKey: ["users"], queryFn: getUsers });
