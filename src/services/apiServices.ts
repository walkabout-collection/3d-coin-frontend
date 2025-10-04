import { Api } from "./api/apiTypes";
import apiClient from "./axiosInstance";

const api = new Api();
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
// forgot password
export const forgotPassword = async (
  data: Parameters<typeof api.auth.forgotPasswordCreate>[0]
): Promise<Awaited<ReturnType<typeof api.auth.forgotPasswordCreate>>["data"]> => {
  const res = await apiClient.post("/auth/forgot-password", data);
  return res.data;
};

// --- AI ---
// upload image
export const uploadImage = async (data: { userId?: string | null; image?: File; prompt?: string | null }) => {
  const formData = new FormData();
  if(data.image) formData.append("image", data.image);
  
  // Only append prompt if it exists  
  if (data.prompt) {
    formData.append("prompt", data.prompt);
  }

  const res = await apiClient.post("/ai-flow/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};



// generate from prompt
export const generateFromPrompt = async (
  data: Parameters<typeof api.aiFlow.generateFromPromptCreate>[0] 
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.generateFromPromptCreate>>["data"]
> => {
  const res = await apiClient.post("/ai-flow/generate-from-prompt", data);
  return res.data;
};
// regenerate
export const regenerate = async (
  data: Parameters<typeof api.aiFlow.regenerateCreate>[0]
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.regenerateCreate>>["data"]
> => {
  const res = await apiClient.post("/ai-flow/regenerate", data);
  return res.data;
};
// coin specification
export const coinSpecification = async (
  data: Parameters<typeof api.aiFlow.coinSpecificationCreate>[0]
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.coinSpecificationCreate>>["data"]
> => {
  const res = await apiClient.post("/ai-flow/coin-specification", data);
  return res.data;
};
// ai preview
export const previewList = async (
  data: Parameters<typeof api.aiFlow.previewList>[0]
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.previewList>>["data"]
> => {
  const res = await apiClient.get("/ai-flow/preview", { params: data });
  return res.data;
};

// save design
export const saveDesign = async (
  data: Parameters<typeof api.aiFlow.saveDesignCreate>[0]
): Promise<Awaited<ReturnType<typeof api.aiFlow.saveDesignCreate>>["data"]> => {
  const res = await apiClient.post("/ai-flow/save-design", data);
  return res.data;
};

// send to designer
export const sendToDesigner = async (
  data: Parameters<typeof api.aiFlow.sendToDesignerCreate>[0] 
): Promise<Awaited<ReturnType<typeof api.aiFlow.sendToDesignerCreate>>["data"]> => {
  const res = await apiClient.post("/ai-flow/send-to-designer", data);
  return res.data;
};

// --- Contact ---
export const createContact = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  description?: string;
  image?: string;
}) => {
  const res = await apiClient.post("/contact/create", data);
  return res.data;
};