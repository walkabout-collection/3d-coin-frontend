
import { Dimension, Material, User } from "./apiTypes";
import apiClient from "./axiosInstance";

// Dimensions
export const getDimensionOptions = async (): Promise<Dimension[]> => {
  const res = await apiClient.get("/dimensions");
  return res.data;
};

export const saveDimensions = async (data: Dimension): Promise<Dimension> => {
  const res = await apiClient.post("/dimensions", data);
  return res.data;
};

// Materials
export const getMaterialOptions = async (): Promise<Material[]> => {
  const res = await apiClient.get("/materials");
  return res.data;
};

export const saveMaterial = async (materialId: string): Promise<Material> => {
  const res = await apiClient.post("/materials", { materialId });
  return res.data;
};

// Users
export const getUsers = async (): Promise<User[]> => {
  const res = await apiClient.get("/users");
  return res.data;
};
