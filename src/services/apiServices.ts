import { Api } from "./api/apiTypes";
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

// --- Auth ---
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
// refresh token
export const refreshToken = async (
  data: Parameters<typeof api.auth.refreshTokenCreate>[0]
): Promise<Awaited<ReturnType<typeof api.auth.refreshTokenCreate>>["data"]> => {
  const res = await apiClient.post("/auth/refresh-token", data);
  return res.data; 
};

// logout
export const logout = async (): Promise<{ message: string }> => {
  const res = await apiClient.post("/auth/logout");
  return res.data;
};
// verify email
export const verifyEmail = async (
  data: Parameters<typeof api.auth.verifyEmailCreate>[0]
): Promise<Awaited<ReturnType<typeof api.auth.verifyEmailCreate>>["data"]> => {
  const res = await apiClient.post("/auth/verify-email", data);
  return res.data;
};

// --- AI ---
// upload image
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiClient.post("/ai/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


// generate from prompt
export const generateFromPrompt = async (
  data: Parameters<typeof api.ai.generateFromPromptCreate>[0] 
): Promise<
  Awaited<ReturnType<typeof api.ai.generateFromPromptCreate>>["data"]
> => {
  const res = await apiClient.post("/ai/generate-from-prompt", data);
  return res.data;
};
// regenerate
export const regenerate = async (
  data: Parameters<typeof api.ai.regenerateCreate>[0]
): Promise<
  Awaited<ReturnType<typeof api.ai.regenerateCreate>>["data"]
> => {
  const res = await apiClient.post("/ai/regenerate", data);
  return res.data;
};
// coin specification
export const coinSpecification = async (
  data: Parameters<typeof api.ai.coinSpecificationCreate>[0]
): Promise<
  Awaited<ReturnType<typeof api.ai.coinSpecificationCreate>>["data"]
> => {
  const res = await apiClient.post("/ai/coin-specification", data);
  return res.data;
};
// ai preview
export const previewList = async (
  data: Parameters<typeof api.ai.previewList>[0]
): Promise<
  Awaited<ReturnType<typeof api.ai.previewList>>["data"]
> => {
  const res = await apiClient.get("/ai/preview", { params: data });
  return res.data;
};

// save design
export const saveDesign = async (
  data: Parameters<typeof api.ai.saveDesignCreate>[0]
): Promise<Awaited<ReturnType<typeof api.ai.saveDesignCreate>>["data"]> => {
  const res = await apiClient.post("/ai/save-design", data);
  return res.data;
};

// send to designer
export const sendToDesigner = async (
  data: Parameters<typeof api.ai.sendToDesignerCreate>[0] 
): Promise<Awaited<ReturnType<typeof api.ai.sendToDesignerCreate>>["data"]> => {
  const res = await apiClient.post("/ai/send-to-designer", data);
  return res.data;
};