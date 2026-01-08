import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  approveAdminQuote,
  approveUserPayment,
  changeUserPassword,
  coinSpecification,
  createContact,
  createDesign,
  createUserPayment,
  createStripeCheckout,
  deleteAdminQuote,
  generateFromPrompt,
  getAdminOrders,
  getAdminQuoteById,
  getAdminQuotes,
  getAdminStat,
  getUserOrders,
  getUserProfile,
  getUserQuotes,
  getUserStats,
  login,
  logout,
  previewList,
  refreshToken,
  regenerate,
  saveDesign,
  sendToDesigner,
  signup,
  updateAdminOrderStatus,
  updateCurrentUserProfile,
  uploadImage,
  verifyEmail,
  generateCoinSide,
  getCoinSides,
  regenerateWithSide,
  generateCompleteCoin,
  getPendingManualPayments,
  getUserOrderHistory,
  getAdminOrderHistory,
  getPaymentPreferences,
  updatePreferredPaymentMethod,
  savePaymentMethod,
  getSavedPaymentMethods,
  setDefaultPaymentMethod,
  deleteSavedPaymentMethod,
  getPaymentMethodFromSession,
} from "@/src/services/apiServices";
import { Api } from "../services/api/apiTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const api = new Api();

// --- Auth ---
// Signup
export const useSignup = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.auth.signupCreate>>["data"],
    Error,
    Parameters<typeof api.auth.signupCreate>[0]
  >,
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
  >,
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
  >,
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
  options?: UseMutationOptions<{ message: string }, Error, void>,
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
  >,
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
  >,
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
  >,
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
  >,
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
  >,
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
  >,
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
  >,
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
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof createContact>>,
    Error,
    Parameters<typeof createContact>[0]
  >({
    mutationFn: createContact,
    ...options,
  });
// create design
export const useCreateDesign = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.design.createCreate>>,
    Error,
    Parameters<typeof api.design.createCreate>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.design.createCreate>>,
    Error,
    Parameters<typeof api.design.createCreate>[0]
  >({
    mutationFn: createDesign,
    ...options,
  });

// get all admin quote
export const useAdminQuotes = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof api.quote.adminList>>["data"],
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.quote.adminList>>["data"], Error>({
    queryKey: ["adminQuotes"],
    queryFn: getAdminQuotes,
    ...options,
  });

export const useUserQuotes = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof api.quote.userList>>["data"],
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.quote.userList>>["data"], Error>({
    queryKey: ["userQuotes"],
    queryFn: getUserQuotes,
    ...options,
  });

// Delete Admin Quote
export const useDeleteAdminQuote = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.quote.adminDelete>>["data"],
    Error,
    string
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.quote.adminDelete>>["data"],
    Error,
    string
  >({
    mutationFn: (id: string) => deleteAdminQuote(id),
    ...options,
  });
// --- Approve Admin Quote ---
export const useApproveAdminQuote = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.quote.adminApproveCreate>>["data"],
    Error,
    { id: string; amount: number }
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.quote.adminApproveCreate>>["data"],
    Error,
    { id: string; amount: number }
  >({
    mutationFn: ({ id, amount }) => approveAdminQuote(id, amount),
    ...options,
  });
// --- Get Admin Quote by ID ---
export const useAdminQuoteById = (
  id: string,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof api.quote.adminDetail>>["data"],
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.quote.adminDetail>>["data"], Error>({
    queryKey: ["adminQuote", id],
    queryFn: () => getAdminQuoteById(id),
    enabled: !!id,
    ...options,
  });
// get all admin order
export const useAdminOrders = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof api.order.adminAllList>>["data"],
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.order.adminAllList>>["data"], Error>({
    queryKey: ["adminOrders"],
    queryFn: getAdminOrders,
    ...options,
  });

export const useUserOrders = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof api.order.userList>>["data"],
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.order.userList>>["data"], Error>({
    queryKey: ["userOrders"],
    queryFn: getUserOrders,
    ...options,
  });
// update admin order status
export const useUpdateAdminOrderStatus = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.order.adminStatusPartialUpdate>>["data"],
    Error,
    {
      orderId: string;
      data: { status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED" };
    }
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.order.adminStatusPartialUpdate>>["data"],
    Error,
    {
      orderId: string;
      data: { status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED" };
    }
  >({
    mutationFn: ({ orderId, data }) => updateAdminOrderStatus(orderId, data),
    ...options,
  });

export const useUpdateCurrentUserProfile = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.api.userProfileUpdate>>["data"],
    Error,
    Parameters<typeof api.api.userProfileUpdate>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.api.userProfileUpdate>>["data"],
    Error,
    Parameters<typeof api.api.userProfileUpdate>[0]
  >({
    mutationFn: (data) => updateCurrentUserProfile(data),
    ...options,
  });

export const useUpdateCurrentUserPassword = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.api.userPasswordUpdate>>["data"],
    Error,
    Parameters<typeof api.api.userPasswordUpdate>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.api.userPasswordUpdate>>["data"],
    Error,
    Parameters<typeof api.api.userPasswordUpdate>[0]
  >({
    mutationFn: (data) => changeUserPassword(data),
    ...options,
  });

export const useGetUserProfile = (
  options?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof api.api.getProfile>>["data"],
      Error
    >
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.api.getProfile>>["data"], Error>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    ...options,
  });

export const useGetAdminStats = (
  options?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof api.api.adminStats>>["data"],
      Error
    >
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.api.adminStats>>["data"], Error>({
    queryKey: ["adminStats"],
    queryFn: getAdminStat,
    ...options,
  });

export const useGetUserStats = (
  options?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof api.api.userStats>>["data"],
      Error
    >
  >,
) =>
  useQuery<Awaited<ReturnType<typeof api.api.userStats>>["data"], Error>({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    ...options,
  });

export const useCreateUserPayment = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createUserPayment>>,
    Error,
    Parameters<typeof createUserPayment>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof createUserPayment>>,
    Error,
    Parameters<typeof createUserPayment>[0]
  >({
    mutationFn: createUserPayment,
    ...options,
  });

export const useApproveUserPayment = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.order.adminApproveUserPayment>>["data"],
    Error,
    string // paymentId
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof api.order.adminApproveUserPayment>>["data"],
    Error,
    string
  >({
    mutationFn: (paymentId) => approveUserPayment(paymentId),
    ...options,
  });

// --- NEW COIN CUSTOMIZATION API HOOKS ---

// Generate coin side (front or back)
export const useGenerateCoinSide = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof generateCoinSide>>,
    Error,
    Parameters<typeof generateCoinSide>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof generateCoinSide>>,
    Error,
    Parameters<typeof generateCoinSide>[0]
  >({
    mutationFn: generateCoinSide,
    ...options,
  });

// Get both sides of a coin
export const useGetCoinSides = (
  designId: string,
  options?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCoinSides>>, Error>
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getCoinSides>>, Error>({
    queryKey: ["coinSides", designId],
    queryFn: () => getCoinSides(designId),
    enabled: !!designId,
    ...options,
  });

// Regenerate with side support
export const useRegenerateWithSide = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof regenerateWithSide>>,
    Error,
    Parameters<typeof regenerateWithSide>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof regenerateWithSide>>,
    Error,
    Parameters<typeof regenerateWithSide>[0]
  >({
    mutationFn: regenerateWithSide,
    ...options,
  });

// --- NEW COMPLETE COIN GENERATION HOOK ---
// Generate both front and back sides in a single API call
export const useGenerateCompleteCoin = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof generateCompleteCoin>>,
    Error,
    Parameters<typeof generateCompleteCoin>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof generateCompleteCoin>>,
    Error,
    Parameters<typeof generateCompleteCoin>[0]
  >({
    mutationFn: generateCompleteCoin,
    ...options,
  });

// --- PAYMENT FLOW HOOKS ---

// Create Stripe checkout session
export const useCreateStripeCheckout = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createStripeCheckout>>,
    Error,
    Parameters<typeof createStripeCheckout>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof createStripeCheckout>>,
    Error,
    Parameters<typeof createStripeCheckout>[0]
  >({
    mutationFn: createStripeCheckout,
    ...options,
  });

// Get pending manual payments (admin)
export const usePendingManualPayments = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPendingManualPayments>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPendingManualPayments>>, Error>({
    queryKey: ["pendingManualPayments"],
    queryFn: getPendingManualPayments,
    ...options,
  });

// Get user order history
export const useUserOrderHistory = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getUserOrderHistory>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getUserOrderHistory>>, Error>({
    queryKey: ["userOrderHistory"],
    queryFn: getUserOrderHistory,
    ...options,
  });

// Get admin order history
export const useAdminOrderHistory = (
  options?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAdminOrderHistory>>, Error>
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getAdminOrderHistory>>, Error>({
    queryKey: ["adminOrderHistory"],
    queryFn: getAdminOrderHistory,
    ...options,
  });

// --- Payment Preferences Hooks ---

// Get payment preferences
export const usePaymentPreferences = (
  options?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getPaymentPreferences>>, Error>
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPaymentPreferences>>, Error>({
    queryKey: ["paymentPreferences"],
    queryFn: getPaymentPreferences,
    ...options,
  });

// Update preferred payment method
export const useUpdatePreferredPaymentMethod = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof updatePreferredPaymentMethod>>,
    Error,
    Parameters<typeof updatePreferredPaymentMethod>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof updatePreferredPaymentMethod>>,
    Error,
    Parameters<typeof updatePreferredPaymentMethod>[0]
  >({
    mutationFn: updatePreferredPaymentMethod,
    ...options,
  });

// Save payment method
export const useSavePaymentMethod = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof savePaymentMethod>>,
    Error,
    Parameters<typeof savePaymentMethod>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof savePaymentMethod>>,
    Error,
    Parameters<typeof savePaymentMethod>[0]
  >({
    mutationFn: savePaymentMethod,
    ...options,
  });

// Get saved payment methods
export const useSavedPaymentMethods = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getSavedPaymentMethods>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getSavedPaymentMethods>>, Error>({
    queryKey: ["savedPaymentMethods"],
    queryFn: getSavedPaymentMethods,
    ...options,
  });

// Set default payment method
export const useSetDefaultPaymentMethod = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof setDefaultPaymentMethod>>,
    Error,
    string
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof setDefaultPaymentMethod>>,
    Error,
    string
  >({
    mutationFn: (paymentMethodId: string) =>
      setDefaultPaymentMethod(paymentMethodId),
    ...options,
  });

// Delete saved payment method
export const useDeleteSavedPaymentMethod = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteSavedPaymentMethod>>,
    Error,
    string
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof deleteSavedPaymentMethod>>,
    Error,
    string
  >({
    mutationFn: (paymentMethodId: string) =>
      deleteSavedPaymentMethod(paymentMethodId),
    ...options,
  });

// Get payment method from Stripe session
export const usePaymentMethodFromSession = (
  sessionId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPaymentMethodFromSession>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPaymentMethodFromSession>>, Error>({
    queryKey: ["paymentMethodFromSession", sessionId],
    queryFn: () => getPaymentMethodFromSession(sessionId!),
    enabled: !!sessionId,
    ...options,
  });
