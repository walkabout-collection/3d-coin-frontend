import { Api, User } from "./api/apiTypes";
import apiClient from "./axiosInstance";

const api = new Api();

// Dimensions
// export const getDimensionOptions = async (): Promise<Dimension[]> => {
//   const res = await apiClient.get("/dimensions");
//   return res.data;
// };

// export const saveDimensions = async (data: Dimension): Promise<Dimension> => {
//   const res = await apiClient.post("/dimensions", data);
//   return res.data;
// };

// Materials
// export const getMaterialOptions = async (): Promise<Material[]> => {
//   const res = await apiClient.get("/materials");
//   return res.data;
// };

// export const saveMaterial = async (materialId: string): Promise<Material> => {
//   const res = await apiClient.post("/materials", { materialId });
//   return res.data;
// };

// Signup
export const signup = async (
  data: Parameters<typeof api.auth.signupCreate>[0]
): Promise<Awaited<ReturnType<typeof api.auth.signupCreate>>["data"]> => {
  const res = await apiClient.post("/auth/signup", data);
  return res.data;
};

// Login
export const login = async (
  data: Parameters<typeof api.auth.loginCreate>[0]
): Promise<Awaited<ReturnType<typeof api.auth.loginCreate>>["data"]> => {
  const res = await apiClient.post("/auth/login", data);
  return res.data.data; 
};

export const refreshToken = async (
  data: Parameters<typeof api.auth.refreshTokenCreate>[0]
): Promise<Awaited<ReturnType<typeof api.auth.refreshTokenCreate>>["data"]> => {
  const res = await apiClient.post("/auth/refresh-token", data);
  return res.data; 
};

