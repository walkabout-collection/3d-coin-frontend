import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { login, logout, refreshToken, signup } from "@/src/services/apiServices";
import { Api, User } from "../services/api/apiTypes";
import {
  coinDiameters,
  coinThicknesses,
} from "../containers/standard-builder/dimensions/data";
import { DimensionData } from "../containers/standard-builder/dimensions/types";

const api = new Api();

// Dimensions
// export const useDimensionOptions = () =>
//   useQuery<Dimension[]>({ queryKey: ["dimensionOptions"], queryFn: getDimensionOptions });

// export const useSaveDimensions = (options?: any) =>
//   useMutation<Dimension, Error, Dimension>({
//     mutationFn: saveDimensions,
//     ...options,
//   });
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

// //  Materials
// export const useMaterialOptions = () =>
//   useQuery<Material[]>({ queryKey: ["materialOptions"], queryFn: getMaterialOptions });

// export const useSaveMaterial = (options?: any) =>
//   useMutation<Material, Error, string>({
//     mutationFn: saveMaterial,
//     ...options,
//   });

// Signup
export const useSignup = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.auth.signupCreate>>["data"],
    Error,
    Parameters<typeof api.auth.signupCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.auth.signupCreate>>["data"],
    Error,
    Parameters<typeof api.auth.signupCreate>[0]
  >({
    mutationFn: signup,
    ...options,
  });

// Login
export const useLogin = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.auth.loginCreate>>["data"], 
    Error,
    Parameters<typeof api.auth.loginCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.auth.loginCreate>>["data"], 
    Error,
    Parameters<typeof api.auth.loginCreate>[0]
  >({
    mutationFn: login,
    ...options,
  });

// Refresh token
export const useRefreshToken = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.auth.refreshTokenCreate>>["data"],
    Error,
    Parameters<typeof api.auth.refreshTokenCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.auth.refreshTokenCreate>>["data"],
    Error,
    Parameters<typeof api.auth.refreshTokenCreate>[0]
  >({
    mutationFn: refreshToken,
    ...options,
  });

// logout
export const useLogout = (
  options?: UseMutationOptions<{ message: string }, Error, void>
) =>
  useMutation<{ message: string }, Error, void>({
    mutationFn: logout,
    ...options,
  });
