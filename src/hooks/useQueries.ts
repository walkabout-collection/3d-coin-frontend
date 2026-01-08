import {
  useQuery,
  useMutation,
  useQueryClient,
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
  getOrderPaymentStatus,
  checkQuoteCanProceed,
  proceedToNextStep,
  getOrderPaymentDetails,
  GetUserOrdersParams,
  getUserOrdersLegacy,
  deleteSavedPaymentMethod,
  getPaymentMethodFromSession,
  initiateQuickBooksOAuth,
  handleQuickBooksCallback,
  getQuickBooksConnectionStatus,
  getQuickBooksTransactions,
  disconnectQuickBooks,
  createQuickBooksInvoice,
  syncQuickBooksTransactions,
  getQuickBooksInvoiceStatus,
  getPaymentReceipt,
  generatePaymentReceipt,
  getPaymentIdFromSession,
  emailPaymentReceipt,
  getPaymentNotifications,
  markNotificationAsRead,
  getPaymentTimeline,
  getAdminQuickBooksConnections,
  getAdminQuickBooksSyncStatus,
  syncAdminQuickBooksPayment,
  getAdminQuickBooksErrors,
  getAdminQuickBooksTransactions,
  getAdminQuickBooksUnmappedTransactions,
  mapAdminQuickBooksTransaction,
  retryAdminQuickBooksFailedSyncs,
  generateCoinDesign,
  getGenerationStatus,
  getQueuePosition,
  cancelGeneration,
  saveDraft,
  getUserDrafts,
  getDraft,
  updateDraft,
  deleteDraft,
  submitDraft,
  type SaveDraftRequest,
  type SubmitDraftRequest,
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

/**
 * Get user orders with payment status (enhanced with filtering, sorting, pagination)
 */
export const useUserOrders = (
  params?: GetUserOrdersParams,
  options?: UseQueryOptions<Awaited<ReturnType<typeof getUserOrders>>, Error>,
) => {
  return useQuery<Awaited<ReturnType<typeof getUserOrders>>, Error>({
    queryKey: ["userOrders", params],
    queryFn: () => getUserOrders(params),
    staleTime: 10000, // 10 seconds
    refetchInterval: (query) => {
      // Poll every 30 seconds if there are pending orders
      const data = query.state.data as
        | Awaited<ReturnType<typeof getUserOrders>>
        | undefined;
      if (data?.data.some((order) => order.paymentStatus === "PENDING")) {
        return 30000;
      }
      return false;
    },
    ...options,
  });
};

/**
 * Legacy useUserOrders for backward compatibility (without params)
 */
export const useUserOrdersLegacy = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getUserOrdersLegacy>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getUserOrdersLegacy>>, Error>({
    queryKey: ["userOrders", "legacy"],
    queryFn: getUserOrdersLegacy,
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
  params?: Parameters<typeof getUserOrderHistory>[0],
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getUserOrderHistory>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getUserOrderHistory>>, Error>({
    queryKey: ["userOrderHistory", params],
    queryFn: () => getUserOrderHistory(params),
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

// --- QuickBooks Integration Hooks ---

// Initiate QuickBooks OAuth flow
export const useInitiateQuickBooksOAuth = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof initiateQuickBooksOAuth>>,
    Error,
    void
  >,
) =>
  useMutation<Awaited<ReturnType<typeof initiateQuickBooksOAuth>>, Error, void>(
    {
      mutationFn: () => initiateQuickBooksOAuth(),
      ...options,
    },
  );

// Handle QuickBooks OAuth callback
export const useHandleQuickBooksCallback = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof handleQuickBooksCallback>>,
    Error,
    Parameters<typeof handleQuickBooksCallback>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof handleQuickBooksCallback>>,
    Error,
    Parameters<typeof handleQuickBooksCallback>[0]
  >({
    mutationFn: handleQuickBooksCallback,
    ...options,
  });

// Get QuickBooks connection status
export const useQuickBooksConnectionStatus = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getQuickBooksConnectionStatus>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getQuickBooksConnectionStatus>>, Error>({
    queryKey: ["quickBooksConnectionStatus"],
    queryFn: getQuickBooksConnectionStatus,
    ...options,
  });

// Get QuickBooks transactions
export const useQuickBooksTransactions = (
  params?: Parameters<typeof getQuickBooksTransactions>[0],
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getQuickBooksTransactions>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getQuickBooksTransactions>>, Error>({
    queryKey: ["quickBooksTransactions", params],
    queryFn: () => getQuickBooksTransactions(params),
    ...options,
  });

// Disconnect QuickBooks account
export const useDisconnectQuickBooks = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof disconnectQuickBooks>>,
    Error,
    void
  >,
) =>
  useMutation<Awaited<ReturnType<typeof disconnectQuickBooks>>, Error, void>({
    mutationFn: () => disconnectQuickBooks(),
    ...options,
  });

// Create QuickBooks invoice
export const useCreateQuickBooksInvoice = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createQuickBooksInvoice>>,
    Error,
    Parameters<typeof createQuickBooksInvoice>[0]
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof createQuickBooksInvoice>>,
    Error,
    Parameters<typeof createQuickBooksInvoice>[0]
  >({
    mutationFn: createQuickBooksInvoice,
    ...options,
  });

// Sync QuickBooks transactions
export const useSyncQuickBooksTransactions = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof syncQuickBooksTransactions>>,
    Error,
    void
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof syncQuickBooksTransactions>>,
    Error,
    void
  >({
    mutationFn: () => syncQuickBooksTransactions(),
    ...options,
  });

// Get QuickBooks invoice status
export const useQuickBooksInvoiceStatus = (
  invoiceId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getQuickBooksInvoiceStatus>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getQuickBooksInvoiceStatus>>, Error>({
    queryKey: ["quickBooksInvoiceStatus", invoiceId],
    queryFn: () => getQuickBooksInvoiceStatus(invoiceId!),
    enabled: !!invoiceId,
    refetchInterval: (query) => {
      // Poll every 10 seconds if invoice is still pending
      const data = query.state.data;
      if (data?.data?.status === "PENDING") {
        return 10000;
      }
      return false;
    },
    ...options,
  });

// --- Receipt Hooks ---

// Get payment receipt
export const usePaymentReceipt = (
  paymentId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPaymentReceipt>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPaymentReceipt>>, Error>({
    queryKey: ["paymentReceipt", paymentId],
    queryFn: () => getPaymentReceipt(paymentId!),
    enabled: !!paymentId,
    ...options,
  });

// Generate payment receipt mutation
export const useGeneratePaymentReceipt = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof generatePaymentReceipt>>,
    Error,
    string
  >,
) =>
  useMutation<
    Awaited<ReturnType<typeof generatePaymentReceipt>>,
    Error,
    string
  >({
    mutationFn: (paymentId: string) => generatePaymentReceipt(paymentId),
    ...options,
  });

// Get payment ID from Stripe session
export const usePaymentIdFromSession = (
  sessionId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPaymentIdFromSession>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPaymentIdFromSession>>, Error>({
    queryKey: ["paymentIdFromSession", sessionId],
    queryFn: () => getPaymentIdFromSession(sessionId!),
    enabled: !!sessionId,
    ...options,
  });

// Email payment receipt mutation
export const useEmailPaymentReceipt = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof emailPaymentReceipt>>,
    Error,
    string
  >,
) =>
  useMutation<Awaited<ReturnType<typeof emailPaymentReceipt>>, Error, string>({
    mutationFn: (paymentId: string) => emailPaymentReceipt(paymentId),
    ...options,
  });

// --- Notification Hooks ---

// Get payment notifications
export const usePaymentNotifications = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPaymentNotifications>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPaymentNotifications>>, Error>({
    queryKey: ["paymentNotifications"],
    queryFn: getPaymentNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });

// Mark notification as read mutation
export const useMarkNotificationAsRead = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof markNotificationAsRead>>,
    Error,
    string
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof markNotificationAsRead>>,
    Error,
    string
  >({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications query
      queryClient.invalidateQueries({ queryKey: ["paymentNotifications"] });
    },
    ...options,
  });
};

// Get payment timeline
export const usePaymentTimeline = (
  paymentId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPaymentTimeline>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getPaymentTimeline>>, Error>({
    queryKey: ["paymentTimeline", paymentId],
    queryFn: () => getPaymentTimeline(paymentId!),
    enabled: !!paymentId,
    ...options,
  });

// --- Admin QuickBooks Hooks ---

// Get all QuickBooks connections (admin)
export const useAdminQuickBooksConnections = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminQuickBooksConnections>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getAdminQuickBooksConnections>>, Error>({
    queryKey: ["admin", "quickbooks", "connections"],
    queryFn: getAdminQuickBooksConnections,
    staleTime: 30000, // 30 seconds
    ...options,
  });

// Get QuickBooks sync status (admin)
export const useAdminQuickBooksSyncStatus = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminQuickBooksSyncStatus>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getAdminQuickBooksSyncStatus>>, Error>({
    queryKey: ["admin", "quickbooks", "sync-status"],
    queryFn: getAdminQuickBooksSyncStatus,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    ...options,
  });

// Get QuickBooks sync errors (admin)
export const useAdminQuickBooksErrors = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminQuickBooksErrors>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getAdminQuickBooksErrors>>, Error>({
    queryKey: ["admin", "quickbooks", "errors"],
    queryFn: getAdminQuickBooksErrors,
    staleTime: 30000,
    ...options,
  });

// Get all QuickBooks transactions (admin)
export const useAdminQuickBooksTransactions = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminQuickBooksTransactions>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getAdminQuickBooksTransactions>>, Error>({
    queryKey: ["admin", "quickbooks", "transactions"],
    queryFn: getAdminQuickBooksTransactions,
    staleTime: 60000, // 1 minute
    ...options,
  });

// Get unmapped QuickBooks transactions (admin)
export const useAdminQuickBooksUnmappedTransactions = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminQuickBooksUnmappedTransactions>>,
    Error
  >,
) =>
  useQuery<
    Awaited<ReturnType<typeof getAdminQuickBooksUnmappedTransactions>>,
    Error
  >({
    queryKey: ["admin", "quickbooks", "unmapped-transactions"],
    queryFn: getAdminQuickBooksUnmappedTransactions,
    staleTime: 60000,
    ...options,
  });

// Sync a payment (mutation)
export const useSyncAdminQuickBooksPayment = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof syncAdminQuickBooksPayment>>,
    Error,
    string
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof syncAdminQuickBooksPayment>>,
    Error,
    string
  >({
    mutationFn: syncAdminQuickBooksPayment,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["admin", "quickbooks"] });
    },
    ...options,
  });
};

// Map a transaction to an order (mutation)
export const useMapAdminQuickBooksTransaction = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof mapAdminQuickBooksTransaction>>,
    Error,
    Parameters<typeof mapAdminQuickBooksTransaction>[0]
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof mapAdminQuickBooksTransaction>>,
    Error,
    Parameters<typeof mapAdminQuickBooksTransaction>[0]
  >({
    mutationFn: mapAdminQuickBooksTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quickbooks"] });
    },
    ...options,
  });
};

// Retry failed syncs (mutation)
export const useRetryAdminQuickBooksFailedSyncs = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof retryAdminQuickBooksFailedSyncs>>,
    Error
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof retryAdminQuickBooksFailedSyncs>>,
    Error
  >({
    mutationFn: retryAdminQuickBooksFailedSyncs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quickbooks"] });
    },
    ...options,
  });
};

// --- AI Generation Hooks (Queue-based) ---

/**
 * Generate coin design (mutation)
 */
export const useGenerateCoinDesign = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof generateCoinDesign>>,
    Error,
    { prompt?: string; imageFile?: File | null; imageUrl?: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof generateCoinDesign>>,
    Error,
    { prompt?: string; imageFile?: File | null; imageUrl?: string }
  >({
    mutationFn: ({ prompt, imageFile, imageUrl }) =>
      generateCoinDesign(prompt, imageFile, imageUrl),
    onSuccess: (data) => {
      // Invalidate queue position
      queryClient.invalidateQueries({ queryKey: ["ai", "queue-position"] });
      // Start polling for status
      if (data.data?.requestId) {
        queryClient.setQueryData(
          ["ai", "generation-status", data.data.requestId],
          {
            requestId: data.data.requestId,
            status: data.data.status,
            queuePosition: data.data.queuePosition,
          },
        );
      }
    },
    ...options,
  });
};

/**
 * Get generation status (with polling)
 */
export const useGenerationStatus = (
  requestId: string | null,
  enabled: boolean = true,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getGenerationStatus>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getGenerationStatus>>, Error>({
    queryKey: ["ai", "generation-status", requestId],
    queryFn: () => getGenerationStatus(requestId!),
    enabled: enabled && !!requestId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      // Poll every 2 seconds if queued or processing
      if (status === "QUEUED" || status === "PROCESSING") {
        return 2000;
      }
      // Stop polling if completed, failed, or cancelled
      return false;
    },
    ...options,
  });

/**
 * Get queue position
 */
export const useQueuePosition = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getQueuePosition>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getQueuePosition>>, Error>({
    queryKey: ["ai", "queue-position"],
    queryFn: getQueuePosition,
    staleTime: 5000, // 5 seconds
    refetchInterval: 10000, // Refresh every 10 seconds
    ...options,
  });

/**
 * Cancel generation (mutation)
 */
export const useCancelGeneration = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof cancelGeneration>>,
    Error,
    string
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof cancelGeneration>>,
    Error,
    string
  >({
    mutationFn: cancelGeneration,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["ai"] });
    },
    ...options,
  });
};

// --- Draft Hooks ---

/**
 * Save draft (mutation)
 */
export const useSaveDraft = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof saveDraft>>,
    Error,
    Parameters<typeof saveDraft>[0]
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof saveDraft>>,
    Error,
    Parameters<typeof saveDraft>[0]
  >({
    mutationFn: saveDraft,
    onSuccess: () => {
      // Invalidate drafts list
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
    },
    ...options,
  });
};

/**
 * Get all user drafts
 */
export const useUserDrafts = (
  options?: UseQueryOptions<Awaited<ReturnType<typeof getUserDrafts>>, Error>,
) =>
  useQuery<Awaited<ReturnType<typeof getUserDrafts>>, Error>({
    queryKey: ["drafts"],
    queryFn: getUserDrafts,
    staleTime: 30000, // 30 seconds
    ...options,
  });

/**
 * Get specific draft
 */
export const useDraft = (
  draftId: string | null,
  options?: UseQueryOptions<Awaited<ReturnType<typeof getDraft>>, Error>,
) =>
  useQuery<Awaited<ReturnType<typeof getDraft>>, Error>({
    queryKey: ["draft", draftId],
    queryFn: () => getDraft(draftId!),
    enabled: !!draftId,
    staleTime: 30000,
    ...options,
  });

/**
 * Update draft (mutation)
 */
export const useUpdateDraft = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof updateDraft>>,
    Error,
    { draftId: string; data: Partial<SaveDraftRequest> }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof updateDraft>>,
    Error,
    { draftId: string; data: Partial<SaveDraftRequest> }
  >({
    mutationFn: ({ draftId, data }) => updateDraft(draftId, data),
    onSuccess: (data, variables) => {
      // Invalidate specific draft and list
      queryClient.invalidateQueries({ queryKey: ["draft", variables.draftId] });
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
    },
    ...options,
  });
};

/**
 * Delete draft (mutation)
 */
export const useDeleteDraft = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDraft>>,
    Error,
    string
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<Awaited<ReturnType<typeof deleteDraft>>, Error, string>({
    mutationFn: deleteDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
    },
    ...options,
  });
};

/**
 * Submit draft (mutation)
 */
export const useSubmitDraft = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof submitDraft>>,
    Error,
    { draftId: string; data: SubmitDraftRequest }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof submitDraft>>,
    Error,
    { draftId: string; data: SubmitDraftRequest }
  >({
    mutationFn: ({ draftId, data }) => submitDraft(draftId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    ...options,
  });
};

// --- Payment Status Hooks ---

/**
 * Get order payment status (query with polling if pending)
 */
export const useOrderPaymentStatus = (
  orderId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getOrderPaymentStatus>>,
    Error
  >,
) => {
  return useQuery<Awaited<ReturnType<typeof getOrderPaymentStatus>>, Error>({
    queryKey: ["orderPaymentStatus", orderId],
    queryFn: () => getOrderPaymentStatus(orderId!),
    enabled: !!orderId,
    staleTime: 5000, // 5 seconds
    refetchInterval: (query) => {
      const data = query.state.data as
        | Awaited<ReturnType<typeof getOrderPaymentStatus>>
        | undefined;
      // Poll every 5 seconds if payment is pending
      if (data?.paymentStatus === "PENDING") {
        return 5000;
      }
      // Stop polling for other statuses
      return false;
    },
    ...options,
  });
};

/**
 * Check if quote can proceed (query)
 */
export const useQuoteCanProceed = (
  quoteId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof checkQuoteCanProceed>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof checkQuoteCanProceed>>, Error>({
    queryKey: ["quoteCanProceed", quoteId],
    queryFn: () => checkQuoteCanProceed(quoteId!),
    enabled: !!quoteId,
    staleTime: 10000, // 10 seconds
    ...options,
  });

/**
 * Proceed to next step (mutation - validates payment)
 */
export const useProceedToNextStep = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof proceedToNextStep>>,
    Error,
    string // orderId
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof proceedToNextStep>>,
    Error,
    string
  >({
    mutationFn: (orderId) => proceedToNextStep(orderId),
    onSuccess: (data, orderId) => {
      // Invalidate payment status and orders
      queryClient.invalidateQueries({
        queryKey: ["orderPaymentStatus", orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
    ...options,
  });
};

/**
 * Get order payment details
 */
export const useOrderPaymentDetails = (
  orderId: string | null,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getOrderPaymentDetails>>,
    Error
  >,
) =>
  useQuery<Awaited<ReturnType<typeof getOrderPaymentDetails>>, Error>({
    queryKey: ["orderPaymentDetails", orderId],
    queryFn: () => getOrderPaymentDetails(orderId!),
    enabled: !!orderId,
    staleTime: 30000, // 30 seconds
    ...options,
  });
