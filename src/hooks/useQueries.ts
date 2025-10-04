import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  coinSpecification,
  createContact,
  generateFromPrompt,
  login,
  logout,
  previewList,
  refreshToken,
  regenerate,
  saveDesign,
  sendToDesigner,
  signup,
  uploadImage,
  verifyEmail,
} from "@/src/services/apiServices";
import { Api } from "../services/api/apiTypes";

const api = new Api();

// --- Auth ---
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
// verify email
export const useVerifyEmail = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.auth.verifyEmailCreate>>["data"],
    Error,
    Parameters<typeof api.auth.verifyEmailCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.auth.verifyEmailCreate>>["data"],
    Error,
    Parameters<typeof api.auth.verifyEmailCreate>[0]
  >({
    mutationFn: verifyEmail,
    ...options,
  });

// --- Ai ---

// upload image
export const useUploadImage = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.aiFlow.uploadImageCreate>>, // return type
    Error,
    Parameters<typeof api.aiFlow.uploadImageCreate>[0] // input type matches { image: File; prompt?: string }
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.aiFlow.uploadImageCreate>>,
    Error,
    Parameters<typeof api.aiFlow.uploadImageCreate>[0]
  >({
    mutationFn: uploadImage,
    ...options,
  });

// generate from prompt
export const useGenerateFromPrompt = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.aiFlow.generateFromPromptCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.generateFromPromptCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.aiFlow.generateFromPromptCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.generateFromPromptCreate>[0]
  >({
    mutationFn: generateFromPrompt,
    ...options,
  });
export const useRegenerate = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.aiFlow.regenerateCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.regenerateCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.aiFlow.regenerateCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.regenerateCreate>[0]
  >({
    mutationFn: regenerate,
    ...options,
  });
// Coin Specification
export const useCoinSpecification = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.aiFlow.coinSpecificationCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.coinSpecificationCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.aiFlow.coinSpecificationCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.coinSpecificationCreate>[0]
  >({
    mutationFn: coinSpecification,
    ...options,
  });
// ai preview
export const usePreviewList = (designId: string) =>
  useQuery<Awaited<ReturnType<typeof api.aiFlow.previewList>>["data"], Error>({
    queryKey: ["previewList", designId],
    queryFn: () => previewList({ designId }),
    enabled: !!designId,
  });
// save design
export const useSaveDesign = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.aiFlow.saveDesignCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.saveDesignCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.aiFlow.saveDesignCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.saveDesignCreate>[0]
  >({
    mutationFn: saveDesign,
    ...options,
  });
// send to designer
export const useSendToDesigner = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.aiFlow.sendToDesignerCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.sendToDesignerCreate>[0]
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof api.aiFlow.sendToDesignerCreate>>["data"],
    Error,
    Parameters<typeof api.aiFlow.sendToDesignerCreate>[0]
  >({
    mutationFn: sendToDesigner,
    ...options,
  });

// --- Contact ---
export const useCreateContact = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createContact>>, // return type of API
    Error,
    Parameters<typeof createContact>[0] // input type of API
  >
) =>
  useMutation<
    Awaited<ReturnType<typeof createContact>>,
    Error,
    Parameters<typeof createContact>[0]
  >({
    mutationFn: createContact,
    ...options,
  });
