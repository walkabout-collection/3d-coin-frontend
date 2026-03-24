import { Api } from "./api/apiTypes";
import apiClient from "./axiosInstance";
import type {
  PaymentPreferences,
  PaymentMethod,
  SavedPaymentMethod,
  ApiResponse,
} from "@/src/types/paymentPreferences";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const api = new Api();
// --- Auth ---
// Signup
export const signup = async (
  data: Parameters<typeof api.auth.signupCreate>[0],
): Promise<Awaited<ReturnType<typeof api.auth.signupCreate>>["data"]> => {
  const res = await apiClient.post("/auth/signup", data);
  return res.data;
};

// Login
export const login = async (
  data: Parameters<typeof api.auth.loginCreate>[0],
): Promise<Awaited<ReturnType<typeof api.auth.loginCreate>>["data"]> => {
  const res = await apiClient.post("/auth/login", data);
  return res.data.data;
};
// refresh token
export const refreshToken = async (
  data: Parameters<typeof api.auth.refreshTokenCreate>[0],
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
  data: Parameters<typeof api.auth.verifyEmailCreate>[0],
): Promise<Awaited<ReturnType<typeof api.auth.verifyEmailCreate>>["data"]> => {
  const res = await apiClient.post("/auth/verify-email", data);
  return res.data;
};
// forgot password
export const forgotPassword = async (
  data: Parameters<typeof api.auth.forgotPasswordCreate>[0],
): Promise<
  Awaited<ReturnType<typeof api.auth.forgotPasswordCreate>>["data"]
> => {
  const res = await apiClient.post("/auth/forgot-password", data);
  return res.data;
};

// --- AI ---
// upload image
export const uploadImage = async (data: {
  userId?: string | null;
  image?: File;
  prompt?: string | null;
}) => {
  const formData = new FormData();
  if (data.image) formData.append("image", data.image);

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
  data: Parameters<typeof api.aiFlow.generateFromPromptCreate>[0],
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.generateFromPromptCreate>>["data"]
> => {
  const res = await apiClient.post("/ai-flow/generate-from-prompt", data);
  return res.data;
};
// regenerate
export const regenerate = async (
  data: Parameters<typeof api.aiFlow.regenerateCreate>[0],
): Promise<Awaited<ReturnType<typeof api.aiFlow.regenerateCreate>>["data"]> => {
  const res = await apiClient.post("/ai-flow/regenerate", data);
  return res.data;
};
// coin specification
export const coinSpecification = async (
  data: Parameters<typeof api.aiFlow.coinSpecificationCreate>[0],
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.coinSpecificationCreate>>["data"]
> => {
  const res = await apiClient.post("/ai-flow/coin-specification", data);
  return res.data;
};
// ai preview
export const previewList = async (
  data: Parameters<typeof api.aiFlow.previewList>[0],
): Promise<Awaited<ReturnType<typeof api.aiFlow.previewList>>["data"]> => {
  const res = await apiClient.get("/ai-flow/preview", { params: data });
  return res.data;
};

// save design
export const saveDesign = async (
  data: Parameters<typeof api.aiFlow.saveDesignCreate>[0],
): Promise<Awaited<ReturnType<typeof api.aiFlow.saveDesignCreate>>["data"]> => {
  const res = await apiClient.post("/ai-flow/save-design", data);
  return res.data;
};

// send to designer
export const sendToDesigner = async (
  data: Parameters<typeof api.aiFlow.sendToDesignerCreate>[0],
): Promise<
  Awaited<ReturnType<typeof api.aiFlow.sendToDesignerCreate>>["data"]
> => {
  const res = await apiClient.post("/ai-flow/send-to-designer", data);
  return res.data;
};

// --- NEW COIN CUSTOMIZATION API ---
// Generate coin side (front or back)
export const generateCoinSide = async (data: {
  side: "front" | "back";
  prompt?: string;
  imageUrl?: string;
  image?: File;
  designId?: string;
}): Promise<{
  success: boolean;
  data: {
    designId: string;
    side: string;
    imageBase64: string;
  };
}> => {
  const formData = new FormData();
  formData.append("side", data.side);

  if (data.prompt) formData.append("prompt", data.prompt);
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.image) formData.append("image", data.image);
  if (data.designId) formData.append("designId", data.designId);

  const res = await apiClient.post("/ai-flow/generate-coin-side", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Generate coin preview artwork (for Standard Builder flow)
// This endpoint generates standalone artwork without coin shapes, borders, or text
export const generateCoinPreview = async (data: {
  side: "front" | "back";
  prompt?: string;
  imageUrl?: string;
  image?: File;
}): Promise<{
  success: boolean;
  data: {
    side: string;
    imageBase64: string;
  };
}> => {
  const formData = new FormData();
  formData.append("side", data.side);

  if (data.prompt) formData.append("prompt", data.prompt);
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.image) formData.append("image", data.image);

  const res = await apiClient.post("/ai-flow/generate-coin-preview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Get both front and back sides
export const getCoinSides = async (
  designId: string,
): Promise<{
  success: boolean;
  data: {
    designId: string;
    front: {
      image: string | null;
      description: string | null;
    };
    back: {
      image: string | null;
      description: string | null;
    };
  };
}> => {
  const res = await apiClient.get("/ai-flow/coin-sides", {
    params: { designId },
  });
  return res.data;
};

// Regenerate with side support
export const regenerateWithSide = async (data: {
  designId: string;
  updates: {
    prompt?: string;
    imageUrl?: string;
    side: "front" | "back";
  };
}): Promise<{
  success: boolean;
  data: {
    designId: string;
    side: string;
    imageBase64: string;
  };
}> => {
  const res = await apiClient.post("/ai-flow/regenerate", data);
  return res.data;
};

// --- NEW COMPLETE COIN GENERATION API ---
// Generate BOTH front and back sides in a single API call
export const generateCompleteCoin = async (data: {
  prompt?: string;
  imageUrl?: string;
  image?: File;
}): Promise<{
  success: boolean;
  data: {
    designId: string;
    front: {
      side: string;
      imageBase64: string;
    };
    back: {
      side: string;
      imageBase64: string;
    };
  };
}> => {
  const formData = new FormData();

  if (data.prompt) formData.append("prompt", data.prompt);
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.image) formData.append("image", data.image);

  const res = await apiClient.post(
    "/ai-flow/generate-complete-coin",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};

// --- AI Generation API Functions (Queue-based) ---

export interface GenerationRequest {
  requestId: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  queuePosition?: number;
  message?: string;
}

export interface GenerationStatus {
  requestId: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  queuePosition?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  designId?: string;
}

export interface QueuePosition {
  queuePosition: number;
  activeRequests: number;
  requests: Array<{
    id: string;
    status: string;
    queuePosition?: number;
    createdAt: string;
  }>;
  queueStats: {
    total: number;
    queued: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

/**
 * Generate coin design (with queue)
 */
export const generateCoinDesign = async (
  prompt?: string,
  imageFile?: File | null,
  imageUrl?: string,
): Promise<{
  success: boolean;
  data: GenerationRequest;
  message?: string;
}> => {
  const formData = new FormData();

  if (prompt) {
    formData.append("prompt", prompt);
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (imageUrl) {
    formData.append("imageUrl", imageUrl);
  }

  const res = await apiClient.post("/ai-flow/generate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/**
 * Get generation status
 */
export const getGenerationStatus = async (
  requestId: string,
): Promise<{
  success: boolean;
  data: GenerationStatus;
  message?: string;
}> => {
  const res = await apiClient.get(`/ai-flow/generation-status/${requestId}`);
  return res.data;
};

/**
 * Get queue position
 */
export const getQueuePosition = async (): Promise<{
  success: boolean;
  data: QueuePosition;
  message?: string;
}> => {
  const res = await apiClient.get("/ai-flow/queue-position");
  return res.data;
};

/**
 * Cancel generation request
 */
export const cancelGeneration = async (
  requestId: string,
): Promise<{
  success: boolean;
  data: {
    requestId: string;
    message: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post(`/ai-flow/cancel/${requestId}`);
  return res.data;
};

// submit design

export const createDesign = async (
  data: Parameters<typeof api.design.createCreate>[0],
): Promise<Awaited<ReturnType<typeof api.design.createCreate>>> => {
  const res = await apiClient.post("/design/create", data);

  return res.data;
};

// --- Draft Design API Functions ---

export interface DraftDesign {
  id: string;
  userId: string;
  name: string;
  status: "DRAFT";
  totalCoins?: number;
  builderType?: "AI Generator" | "Standard Builder";
  generatorPrompt?: string;
  generatorImage?: string;
  designerInstructions?: string;
  frontImage?: string;
  frontDescription?: string;
  frontText?: string;
  frontTextStyle?: string;
  frontReference?: string;
  frontReferenceImpact?: string;
  frontComposition?: string;
  backImage?: string;
  backDescription?: string;
  backText?: string;
  backTextStyle?: string;
  backReference?: string;
  backReferenceImpact?: string;
  backComposition?: string;
  coinShape?: string;
  subject?: string;
  materialFinish?: string;
  contrastStyle?: string;
  detailLevel?: string;
  prohibitedContent?: string;
  createdAt: string;
  updatedAt: string;
  previewImage?: string;
  variants?: Array<{
    id: string;
    imageUrl?: string;
    imageBase64?: string;
  }>;
}

export interface SaveDraftRequest {
  name?: string;
  totalCoins?: number;
  builderType?: "AI Generator" | "Standard Builder";
  generatorPrompt?: string;
  generatorImage?: string;
  designerInstructions?: string;
  frontImage?: string;
  frontDescription?: string;
  frontText?: string;
  frontTextStyle?: string;
  frontReference?: string;
  frontReferenceImpact?: string;
  frontComposition?: string;
  backImage?: string;
  backDescription?: string;
  backText?: string;
  backTextStyle?: string;
  backReference?: string;
  backReferenceImpact?: string;
  backComposition?: string;
  coinShape?: string;
  subject?: string;
  materialFinish?: string;
  contrastStyle?: string;
  detailLevel?: string;
  prohibitedContent?: string;
}

// Export for use in components
export type {
  SaveDraftRequest as SaveDraftRequestType,
  SubmitDraftRequest as SubmitDraftRequestType,
};

export interface SubmitDraftRequest {
  amount?: number;
  method: "STRIPE" | "QUICKBOOKS" | "MANUAL";
  feedback?: string;
  packaging?: {
    description?: string;
    referenceImg?: string;
    text?: string;
  };
}

/**
 * Save design as draft
 */
export const saveDraft = async (
  data: SaveDraftRequest,
): Promise<DraftDesign> => {
  const res = await apiClient.post<ApiResponse<DraftDesign>>(
    "/design/draft/create",
    data,
  );
  return res.data.data;
};

/**
 * Get all user drafts
 */
export const getUserDrafts = async (): Promise<DraftDesign[]> => {
  const res =
    await apiClient.get<ApiResponse<DraftDesign[]>>("/design/draft/list");
  return res.data.data;
};

/**
 * Get specific draft
 */
export const getDraft = async (draftId: string): Promise<DraftDesign> => {
  const res = await apiClient.get<ApiResponse<DraftDesign>>(
    `/design/draft/${draftId}`,
  );
  return res.data.data;
};

/**
 * Update draft
 */
export const updateDraft = async (
  draftId: string,
  data: Partial<SaveDraftRequest>,
): Promise<DraftDesign> => {
  const res = await apiClient.put<ApiResponse<DraftDesign>>(
    `/design/draft/${draftId}`,
    data,
  );
  return res.data.data;
};

/**
 * Delete draft
 */
export const deleteDraft = async (
  draftId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await apiClient.delete<
      ApiResponse<{
        success: boolean;
        message: string;
      }>
    >(`/design/draft/${draftId}`);
    return res.data.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to delete draft";

    // Check if it's a foreign key constraint error
    if (
      errorMessage.includes("foreign key") ||
      errorMessage.includes("Variant") ||
      errorMessage.includes("RESTRICT")
    ) {
      throw new Error(
        "Cannot delete this draft. It is being used in a variant and cannot be removed.",
      );
    }

    throw new Error(errorMessage);
  }
};

/**
 * Quote data structure from draft submission
 */
export interface DraftQuote {
  id: string;
  designId: string;
  amount?: number;
  method: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/**
 * Submit draft (convert to quote)
 */
export const submitDraft = async (
  draftId: string,
  data: SubmitDraftRequest,
): Promise<{
  design: DraftDesign;
  quote: DraftQuote | null;
}> => {
  const res = await apiClient.post<
    ApiResponse<{
      design: DraftDesign;
      quote: DraftQuote | null;
    }>
  >(`/design/draft/${draftId}/submit`, data);
  return res.data.data;
};

// --- S3 Upload ---
// Get presigned URL for uploading to S3
export const getS3UploadUrl = async (data: {
  fileName: string;
  mimeType: string;
}): Promise<{
  url?: string;
  key?: string;
}> => {
  const res = await apiClient.post("/s3/upload-url", data);
  return res.data;
};

// Get presigned URL for retrieving from S3
export const getS3RetrieveUrl = async (
  fileName: string,
): Promise<{
  url?: string;
}> => {
  const res = await apiClient.get(
    `/s3/retrieve-url/${encodeURIComponent(fileName)}`,
  );
  return res.data;
};

// Convert blob URL to base64
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const _blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Upload base64 image to S3 and return the S3 key
export const uploadBase64ToS3 = async (
  base64Image: string,
  fileName: string = `image-${Date.now()}.png`,
): Promise<string> => {
  try {
    const normalized = base64Image.trim();

    // Support both:
    // - base64 data URLs: data:<mime>;base64,<data>
    // - non-base64 data URLs: data:<mime>,<data> (e.g. svg+xml utf8)
    const base64Matches = normalized.match(/^data:(.*?);base64,([\s\S]*)$/);

    let mimeType: string;
    let blob: Blob;

    if (base64Matches) {
      // Extract mime type from base64 data URL
      mimeType = base64Matches[1];
      const base64Data = base64Matches[2].replace(/\s/g, "");

      console.log(
        `[S3 Upload] Starting upload for ${fileName}, mimeType: ${mimeType}`,
      );

      // Convert base64 to blob
      const byteString = atob(base64Data);
      const n = byteString.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([u8arr], { type: mimeType });
    } else if (normalized.startsWith("data:")) {
      // Non-base64 data URL: fetch it into a Blob first.
      const mimeTypeMatch = normalized.match(/^data:([^;,]+)(?:;|,)/);
      mimeType = mimeTypeMatch?.[1] || "application/octet-stream";

      const fetched = await fetch(normalized);
      if (!fetched.ok) {
        throw new Error(
          `Failed to fetch data URL for ${fileName} (status ${fetched.status})`,
        );
      }

      blob = await fetched.blob();
      // Prefer actual blob type when available.
      mimeType = blob.type || mimeType;

      console.log(
        `[S3 Upload] Starting upload for ${fileName}, mimeType: ${mimeType} (from non-base64 data URL)`,
      );
    } else {
      throw new Error("Invalid base64 string format");
    }

    // Get presigned URL
    let presignedResponse;
    try {
      presignedResponse = await getS3UploadUrl({
        fileName,
        mimeType,
      });
      console.log("[S3 Upload] Presigned URL received:", {
        hasUrl: !!presignedResponse.url,
        hasKey: !!presignedResponse.key,
        key: presignedResponse.key,
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("[S3 Upload] Failed to get presigned URL:", error);
      throw new Error(
        `Failed to get presigned URL: ${errMsg || "Unknown error"}`,
      );
    }

    const { url, key } = presignedResponse;

    if (!url || !key) {
      console.error(
        "[S3 Upload] Missing url or key in response:",
        presignedResponse,
      );
      throw new Error(
        "Failed to get presigned URL from S3 - missing url or key",
      );
    }

    console.log(
      `[S3 Upload] Uploading blob to S3 (size: ${blob.size} bytes, type: ${mimeType})`,
    );

    // Upload to S3 using presigned URL
    // CRITICAL: Use raw fetch ONLY with Content-Type header
    // DO NOT use axios or any wrapper that might add headers
    // DO NOT add any x-amz-* headers manually
    let uploadResponse;
    try {
      uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": mimeType, // ONLY header allowed - must match what backend signed
        },
        body: blob,
      });
    } catch (fetchError) {
      const errMsg =
        fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error("[S3 Upload] Fetch error (network/CORS):", fetchError);
      throw new Error(
        `Network error during upload: ${errMsg || "Unknown fetch error"}. Check CORS configuration.`,
      );
    }

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse
        .text()
        .catch(() => "Could not read error response");
      const errorDetails = {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
        url: url.substring(0, 150) + "...",
        mimeType,
        fileName,
      };
      console.error("[S3 Upload] Upload failed:", errorDetails);

      // Provide more specific error messages
      if (uploadResponse.status === 403) {
        throw new Error(
          `S3 Access Denied (403). The presigned URL may be invalid or expired. Check if Content-Type is signed correctly in presigned URL.`,
        );
      } else if (uploadResponse.status === 400) {
        throw new Error(
          `S3 Bad Request (400). Content-Type mismatch or invalid request. Error: ${errorText}`,
        );
      }

      throw new Error(
        `Failed to upload to S3 (${uploadResponse.status}): ${uploadResponse.statusText}. ${errorText}`,
      );
    }

    console.log(
      `[S3 Upload] Successfully uploaded ${fileName} to S3 with key: ${key}`,
    );
    // Return the S3 key
    return key;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `[S3 Upload] Error in uploadBase64ToS3 for ${fileName}: ${errMsg}`,
      error,
    );
    // Re-throw with context
    throw error;
  }
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

export interface GetAdminQuotesParams {
  page?: number;
  limit?: number;
  sortBy?: "date" | "amount" | "status";
  sortOrder?: "asc" | "desc";
  status?: string;
}

// get all quote admin
export const getAdminQuotes = async (
  params?: GetAdminQuotesParams,
): Promise<{
  success: boolean;
  data: unknown[]; // Quote[] array - using unknown[] to handle API response flexibility
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  stats?: {
    pendingQuotes: number;
    approvedQuotes: number;
  };
}> => {
  const queryParams = new URLSearchParams();

  // Default values: page=1, limit=4 (as per API spec)
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 4;

  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.status) queryParams.append("status", params.status);

  const queryString = queryParams.toString();
  const url = `/quote/admin${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await apiClient.get(url, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // API Response Structure: { success, message, data: { data: [], pagination: {}, stats: {} } }
    if (res.data?.success && res.data?.data) {
      const responseData = res.data.data;

      // Extract quotes array, pagination, and stats from nested structure
      const quotes = Array.isArray(responseData.data) ? responseData.data : [];
      const pagination = responseData.pagination || {
        page: page,
        limit: limit,
        total: quotes.length,
        totalPages: Math.ceil(quotes.length / limit) || 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      const stats = responseData.stats || {
        pendingQuotes: 0,
        approvedQuotes: 0,
      };

      return {
        success: true,
        data: quotes,
        pagination,
        stats,
      };
    }

    // Fallback for backward compatibility
    const data = Array.isArray(res.data.data)
      ? res.data.data
      : res.data.data?.data || res.data.data || [];
    return {
      success: true,
      data,
      pagination: {
        page: page,
        limit: limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit) || 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      stats: {
        pendingQuotes: 0,
        approvedQuotes: 0,
      },
    };
  } catch (error: unknown) {
    // Enhance error with status code for better error handling
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const status = axiosError.response?.status;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to fetch admin quotes";

    const enhancedError = new Error(errorMessage);
    (enhancedError as { status?: number; response?: unknown }).status = status;
    (enhancedError as { status?: number; response?: unknown }).response =
      axiosError.response;

    throw enhancedError;
  }
};

export interface GetUserQuotesParams {
  page?: number;
  limit?: number;
  sortBy?: "date" | "amount" | "status";
  sortOrder?: "asc" | "desc";
  status?: string;
}

export const getUserQuotes = async (
  params?: GetUserQuotesParams,
): Promise<{
  success: boolean;
  data: unknown[]; // Quote[] array - using unknown[] to handle API response flexibility
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  stats?: {
    pendingQuotes: number;
    approvedQuotes: number;
  };
}> => {
  const queryParams = new URLSearchParams();

  // Default values: page=1, limit=4 (as per API spec)
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 4;

  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.status) queryParams.append("status", params.status);

  const queryString = queryParams.toString();
  const url = `/quote/user${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await apiClient.get(url, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // API Response Structure: { success, message, data: { data: [], pagination: {}, stats: {} } }
    if (res.data?.success && res.data?.data) {
      const responseData = res.data.data;

      // Extract quotes array, pagination, and stats from nested structure
      const quotes = Array.isArray(responseData.data) ? responseData.data : [];
      const pagination = responseData.pagination || {
        page: page,
        limit: limit,
        total: quotes.length,
        totalPages: Math.ceil(quotes.length / limit) || 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      const stats = responseData.stats || {
        pendingQuotes: 0,
        approvedQuotes: 0,
      };

      return {
        success: true,
        data: quotes,
        pagination,
        stats,
      };
    }

    // Fallback for backward compatibility
    const data = Array.isArray(res.data.data)
      ? res.data.data
      : res.data.data?.data || res.data.data || [];
    return {
      success: true,
      data,
      pagination: {
        page: page,
        limit: limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit) || 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      stats: {
        pendingQuotes: 0,
        approvedQuotes: 0,
      },
    };
  } catch (error: unknown) {
    // Enhance error with status code for better error handling
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const status = axiosError.response?.status;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to fetch user quotes";

    const enhancedError = new Error(errorMessage);
    (enhancedError as { status?: number; response?: unknown }).status = status;
    (enhancedError as { status?: number; response?: unknown }).response =
      axiosError.response;

    throw enhancedError;
  }
};
// delete quote
export const deleteAdminQuote = async (
  id: string,
): Promise<Awaited<ReturnType<typeof api.quote.adminDelete>>["data"]> => {
  const res = await apiClient.delete(`/quote/admin/${id}`);
  return res.data;
};
// --- Approve Admin Quote ---
export const approveAdminQuote = async (
  id: string,
  amount: number | string,
): Promise<
  Awaited<ReturnType<typeof api.quote.adminApproveCreate>>["data"]
> => {
  const numericAmount =
    typeof amount === "number" ? amount : parseFloat(String(amount));
  if (Number.isNaN(numericAmount)) {
    throw new Error("Invalid amount: must be a number");
  }
  const res = await apiClient.post(`/quote/admin/${id}/approve`, {
    amount: numericAmount,
  });
  return res.data;
};
// --- Get Admin Quote by ID ---
export const getAdminQuoteById = async (
  id: string,
): Promise<Awaited<ReturnType<typeof api.quote.adminDetail>>["data"]> => {
  const res = await apiClient.get(`/quote/admin/${id}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data.data;
};
// get all admin orders
export const getAdminOrders = async (): Promise<
  Awaited<ReturnType<typeof api.order.adminAllList>>["data"]
> => {
  const res = await apiClient.get("/order/admin/all", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data.data;
};

/**
 * User order with payment status
 */
export interface CoinDesign {
  id: string;
  userId?: string;
  name: string;
  status: string;
  totalCoins?: number;
  generatorPrompt?: string;
  generatorImage?: string;
  designerInstructions?: string;
  frontImage?: string;
  frontDescription?: string;
  frontText?: string;
  frontTextStyle?: string;
  frontReference?: string;
  frontReferenceImpact?: string;
  frontComposition?: string;
  backImage?: string;
  backDescription?: string;
  backText?: string;
  backTextStyle?: string;
  backReference?: string;
  backReferenceImpact?: string;
  backComposition?: string;
  coinShape?: string;
  subject?: string;
  materialFinish?: string;
  contrastStyle?: string;
  detailLevel?: string;
  prohibitedContent?: string | null;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Packaging {
  id: string;
  description?: string;
  referenceImg?: string;
  text?: string;
  createdAt: string;
  userId?: string;
}

export interface Quote {
  id: string;
  userId?: string;
  orderId: string;
  status: string;
  amount?: number;
  feedback?: string | null;
  createdAt: string;
  designStatus?: string;
  method: string;
  totalCoins?: number;
  coinDesignId: string;
  packagingId: string;
  email?: string;
  CoinDesign?: CoinDesign;
  Packaging?: Packaging;
}

export interface Payment {
  id: string;
  orderId: string;
  quoteId: string;
  userId?: string;
  method: string;
  status: string;
  amount: number;
  paidAt?: string | null;
  createdAt: string;
  paymentProof?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripeCustomerId?: string | null;
  quickbooksInvoiceId?: string | null;
  quickbooksSyncStatus?: string | null;
  quickbooksLastSyncAt?: string | null;
  idempotencyKey?: string;
  receiptUrl?: string | null;
  receiptGeneratedAt?: string | null;
}

export interface UserOrder {
  id: string;
  userId?: string;
  carrier?: string | null;
  status: string;
  weight?: number | null;
  orderDate: string;
  totalCoins?: number | null;
  totalPrice: number;
  orderId: string;
  paymentStatus: "PAID" | "UNPAID" | "PENDING" | "FAILED";
  paymentMethod?: string;
  paymentDate?: string | null;
  paymentId?: string | null;
  Quote?: Quote[];
  Payment?: Payment[];
}

/**
 * Get user orders params
 */
export interface GetUserOrdersParams {
  paymentStatus?: "PAID" | "UNPAID" | "PENDING" | "FAILED" | "REFUNDED";
  sortBy?: "date" | "amount" | "paymentStatus" | "paymentDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * Get user orders with payment status (enhanced)
 * Endpoint: GET /api/orders/user?paymentStatus=PAID|UNPAID&page=1&limit=20&sortBy=date&sortOrder=desc
 *
 * Retrieves authenticated user's orders with optional filtering by payment status.
 *
 * @param params - Query parameters for filtering and pagination
 * @returns User orders with pagination
 */
export const getUserOrders = async (
  params?: GetUserOrdersParams,
): Promise<{
  data: UserOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> => {
  const queryParams = new URLSearchParams();

  if (params?.paymentStatus) {
    queryParams.append("paymentStatus", params.paymentStatus);
  }
  if (params?.sortBy) {
    queryParams.append("sortBy", params.sortBy);
  }
  if (params?.sortOrder) {
    queryParams.append("sortOrder", params.sortOrder);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  const queryString = queryParams.toString();
  const url = `/order/user${queryString ? `?${queryString}` : ""}`;

  const res = await apiClient.get<
    ApiResponse<{
      data: UserOrder[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    }>
  >(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  return res.data.data;
};

/**
 * Legacy getUserOrders for backward compatibility (without params)
 */
export const getUserOrdersLegacy = async (): Promise<
  Awaited<ReturnType<typeof api.order.userList>>["data"]
> => {
  const res = await apiClient.get("/order/user", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data.data;
};

// update admin order status
export const updateAdminOrderStatus = async (
  orderId: string,
  data: {
    status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED";
  },
): Promise<
  Awaited<ReturnType<typeof api.order.adminStatusPartialUpdate>>["data"]
> => {
  const res = await apiClient.patch(`/order/admin/${orderId}/status`, data);
  return res.data;
};

// --- Payment Status Check ---
/**
 * Payment status values
 */
export type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "UNPAID"
  | "FAILED"
  | "REFUNDED";

/**
 * Order payment status response
 * Matches API response from GET /api/orders/:orderId/payment-status
 */
export interface OrderPaymentStatus {
  orderId: string;
  orderNumber?: string; // Optional, may not be in all responses
  paymentStatus: PaymentStatus;
  amount?: number;
  paymentMethod?: string;
  paymentDate?: string;
  paymentDeadline?: string;
  paymentId?: string; // Payment ID if available
  canProceed: boolean;
}

/**
 * Quote can proceed response
 * Matches API response from GET /api/quotes/:quoteId/can-proceed
 */
export interface QuoteCanProceed {
  canProceed: boolean;
  reason: string; // Reason if cannot proceed
  quoteStatus: "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: PaymentStatus | null;
  orderExists: boolean;
  orderId: string | null;
  amount?: number;
  quoteId?: string; // Optional, may not be in response
}

/**
 * Proceed to next step response
 * Matches API response from POST /api/orders/:orderId/proceed
 */
export interface ProceedToNextStepResponse {
  orderId: string;
  orderNumber?: string;
  status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED";
  paymentStatus: PaymentStatus;
  message: string;
}

/**
 * Get payment status for an order
 * Endpoint: GET /api/orders/:orderId/payment-status
 *
 * @param orderId - The order ID
 * @returns Order payment status with canProceed flag
 */
export const getOrderPaymentStatus = async (
  orderId: string,
): Promise<OrderPaymentStatus> => {
  const res = await apiClient.get<ApiResponse<OrderPaymentStatus>>(
    `/order/${orderId}/payment-status`,
  );
  return res.data.data;
};

/**
 * Check if a quote can proceed to next step
 * Endpoint: GET /api/quotes/:quoteId/can-proceed
 *
 * @param quoteId - The quote ID
 * @returns Quote can proceed status with reason and payment status
 */
export const checkQuoteCanProceed = async (
  quoteId: string,
): Promise<QuoteCanProceed> => {
  const res = await apiClient.get<ApiResponse<QuoteCanProceed>>(
    `/quote/${quoteId}/can-proceed`,
  );
  return res.data.data;
};

/**
 * Proceed to next step (validates payment)
 * Endpoint: POST /api/orders/:orderId/proceed
 *
 * Validates that payment is completed and allows the order to proceed.
 * Updates order status to APPROVED if payment is PAID.
 *
 * @param orderId - The order ID
 * @returns Order proceed response with updated status
 */
export const proceedToNextStep = async (
  orderId: string,
): Promise<ProceedToNextStepResponse> => {
  const res = await apiClient.post<ApiResponse<ProceedToNextStepResponse>>(
    `/order/${orderId}/proceed`,
    {},
  );
  return res.data.data;
};

/**
 * Order payment details response
 */
export interface OrderPaymentDetails {
  orderId: string;
  orderNumber: string;
  paymentStatus: "PAID" | "UNPAID" | "PENDING" | "FAILED";
  paymentMethod?: string;
  paymentDate?: string;
  paymentId?: string;
  amount: number;
  payments: Array<{
    id: string;
    method: string;
    status: string;
    amount: number;
    paidAt?: string;
    createdAt: string;
    receiptUrl?: string;
    stripeCheckoutSessionId?: string;
    quickbooksInvoiceId?: string;
  }>;
  quote: {
    id: string;
    amount?: number;
    status: string;
  } | null;
}

/**
 * Get order payment details
 */
export const getOrderPaymentDetails = async (
  orderId: string,
): Promise<OrderPaymentDetails> => {
  const res = await apiClient.get<ApiResponse<OrderPaymentDetails>>(
    `/order/${orderId}/payment-details`,
  );
  return res.data.data;
};

export const updateCurrentUserProfile = async (
  data: Parameters<typeof api.api.userProfileUpdate>[0],
): Promise<Awaited<ReturnType<typeof api.api.userProfileUpdate>>["data"]> => {
  const res = await apiClient.put("/users/profile/update", data);
  return res.data;
};

export const changeUserPassword = async (
  data: Parameters<typeof api.api.changePassword>[0],
): Promise<Awaited<ReturnType<typeof api.api.changePassword>>["data"]> => {
  const res = await apiClient.put("/users/password/change", data);
  return res.data;
};

export const getUserProfile = async (): Promise<
  Awaited<ReturnType<typeof api.api.getProfile>>["data"]
> => {
  const res = await apiClient.get("/users/profile");
  return res.data.data;
};

export const getAdminStat = async (): Promise<
  Awaited<ReturnType<typeof api.api.adminStats>>["data"]
> => {
  const res = await apiClient.get("/quote/admin/get/stats");
  return res.data.data;
};

export const getUserStats = async (): Promise<
  Awaited<ReturnType<typeof api.api.userStats>>["data"]
> => {
  const res = await apiClient.get("/quote/user/get/stats");
  return res.data.data;
};

export const approveUserPayment = async (
  paymentId: string,
): Promise<
  Awaited<ReturnType<typeof api.order.adminApproveUserPayment>>["data"]
> => {
  const res = await apiClient.patch(
    `/order/admin/payment/${paymentId}/approve`,
  );
  return res.data;
};

export const createUserPayment = async (data: {
  quoteId: string;
  amount: number;
  method: "MANUAL" | "STRIPE" | "QUICKBOOKS";
  paymentProof?: string; // Base64 encoded image for manual payments
}): Promise<{
  success: boolean;
  data: {
    id: string;
    status: string;
    quoteId: string;
    amount: number;
    method: string;
    paymentProof?: string;
    createdAt: string;
  };
  message: string;
}> => {
  const res = await apiClient.post("/order/user/payment/create", data);
  return res.data;
};

// Create Stripe checkout session
export const createStripeCheckout = async (data: {
  quoteId: string;
  currency?: string;
  idempotencyKey?: string;
}): Promise<{
  success: boolean;
  data: {
    sessionId: string;
    url: string;
    paymentId: string;
  };
}> => {
  const res = await apiClient.post("/stripe/checkout/create", data);
  return res.data;
};

// Get pending manual payments (admin)
export const getPendingManualPayments = async (): Promise<{
  success: boolean;
  data: Array<{
    paymentId: string;
    quoteId: string;
    amount: number;
    paymentProof: string;
    createdAt: string;
    customer: string;
    customerEmail: string;
    quote: {
      id: string;
      totalCoins: number;
      status: string;
    };
  }>;
}> => {
  const res = await apiClient.get("/order/admin/payments/pending");
  return res.data;
};

// Get user order history
export interface GetUserOrderHistoryParams {
  sortBy?: "date" | "amount" | "status";
  sortOrder?: "asc" | "desc";
  status?: "SUCCESS" | "PENDING" | "FAILED" | "APPROVED" | "REJECTED";
  method?: "STRIPE" | "QUICKBOOKS" | "MANUAL";
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
  search?: string; // Search by order ID
}

export const getUserOrderHistory = async (
  params?: GetUserOrderHistoryParams,
): Promise<{
  success: boolean;
  data: {
    data: Array<{
      orderId: string;
      paymentMethod: string;
      paymentStatus?: string;
      total: number;
      date: string;
      status?: string;
      paymentId?: string;
      totalCoins?: number | null;
    }>;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}> => {
  const queryParams = new URLSearchParams();

  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.method) queryParams.append("method", params.method);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const queryString = queryParams.toString();
  const url = `/order/user/history${queryString ? `?${queryString}` : ""}`;

  const res = await apiClient.get(url);

  // Handle nested response structure: { success, data: { data: [...], pagination: {...} } }
  // Also handle flat structure for backward compatibility: { success, data: [...], pagination: {...} }
  if (res.data.success && res.data.data) {
    // Check if data is nested (has data.data)
    if (res.data.data.data && Array.isArray(res.data.data.data)) {
      return res.data;
    }
    // If data is directly an array, wrap it in the nested structure
    if (Array.isArray(res.data.data)) {
      return {
        ...res.data,
        data: {
          data: res.data.data,
          pagination: res.data.pagination,
        },
      };
    }
  }

  return res.data;
};

export interface GetAdminOrderHistoryParams {
  page?: number;
  limit?: number;
}

// Get admin order history
export const getAdminOrderHistory = async (
  params?: GetAdminOrderHistoryParams,
): Promise<{
  success: boolean;
  data: {
    data: Array<{
      orderId: string;
      paymentMethod: string;
      total: number;
      date: string;
      status: string;
      customer: string;
      customerEmail: string;
    }>;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  };
}> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const url = `/order/admin/history${queryString ? `?${queryString}` : ""}`;

  const res = await apiClient.get(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  // Handle nested structure: { data: { data: [...], pagination: {...} } }
  // Also handle flat structure for backward compatibility: { data: [...] }
  if (res.data.data && Array.isArray(res.data.data)) {
    // Flat structure - wrap it
    return {
      ...res.data,
      data: {
        data: res.data.data,
      },
    };
  }
  // Nested structure - ensure data.data is an array
  if (
    res.data.data &&
    res.data.data.data &&
    !Array.isArray(res.data.data.data)
  ) {
    console.warn(
      "API returned non-array for admin order history data, defaulting to empty array.",
    );
    return { ...res.data, data: { ...res.data.data, data: [] } };
  }
  return res.data;
};

// --- Payment Preferences API ---

// Get payment preferences
export const getPaymentPreferences = async (): Promise<
  ApiResponse<PaymentPreferences>
> => {
  const res = await apiClient.get("/payment-preferences");
  return res.data;
};

// Update preferred payment method
export const updatePreferredPaymentMethod = async (data: {
  paymentMethod: PaymentMethod;
}): Promise<ApiResponse<unknown>> => {
  const res = await apiClient.post(
    "/payment-preferences/preferred-method",
    data,
  );
  return res.data;
};

// Save payment method
export const savePaymentMethod = async (data: {
  paymentMethodId: string;
  setAsDefault?: boolean;
}): Promise<ApiResponse<SavedPaymentMethod>> => {
  const res = await apiClient.post("/payment-preferences/save-method", data);
  return res.data;
};

// Get saved payment methods
export const getSavedPaymentMethods = async (): Promise<
  ApiResponse<SavedPaymentMethod[]>
> => {
  const res = await apiClient.get("/payment-preferences/saved-methods");
  return res.data;
};

// Set default payment method
export const setDefaultPaymentMethod = async (
  paymentMethodId: string,
): Promise<ApiResponse<SavedPaymentMethod>> => {
  const res = await apiClient.put(
    `/payment-preferences/default/${paymentMethodId}`,
  );
  return res.data;
};

// Delete saved payment method
export const deleteSavedPaymentMethod = async (
  paymentMethodId: string,
): Promise<ApiResponse<unknown>> => {
  const res = await apiClient.delete(
    `/payment-preferences/saved-methods/${paymentMethodId}`,
  );
  return res.data;
};

// Get payment method from Stripe session
export const getPaymentMethodFromSession = async (
  sessionId: string,
): Promise<ApiResponse<{ paymentMethodId: string; sessionId: string }>> => {
  const res = await apiClient.get(
    `/stripe/session/${sessionId}/payment-method`,
  );
  return res.data;
};

// Get payment ID from Stripe session
export const getPaymentIdFromSession = async (
  sessionId: string,
): Promise<{
  success: boolean;
  data: {
    paymentId: string;
    sessionId: string;
    status: "SUCCESS" | "PENDING" | "FAILED";
  };
  message?: string;
}> => {
  const res = await apiClient.get(`/stripe/session/${sessionId}/payment-id`);
  return res.data;
};

// --- Receipt API Functions ---

// Get receipt download URL
export const getPaymentReceipt = async (
  paymentId: string,
): Promise<{
  success: boolean;
  data: {
    receiptUrl: string;
    receiptGeneratedAt?: string;
  };
  message?: string;
}> => {
  const res = await apiClient.get(`/payments/${paymentId}/receipt`);
  return res.data;
};

// Generate receipt for payment
export const generatePaymentReceipt = async (
  paymentId: string,
): Promise<{
  success: boolean;
  data: {
    receiptUrl: string;
    receiptGeneratedAt: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post(`/payments/${paymentId}/receipt/generate`);
  return res.data;
};

// Email receipt to user
export const emailPaymentReceipt = async (
  paymentId: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const res = await apiClient.post(`/payments/${paymentId}/receipt/email`);
  return res.data;
};

// --- Notification API Functions ---

// Get payment status by paymentId
// Note: According to the API docs, we need orderId to get payment status
// If you only have paymentId, you need to find the orderId first using getOrderPaymentDetails
// or get the orderId from the payment response
export const getPaymentStatus = async (
  paymentId: string,
): Promise<{
  success: boolean;
  data: {
    paymentId: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
    amount: number;
    paidAt?: string;
    orderId?: string;
    orderStatus?: string;
    quoteId?: string;
    quoteStatus?: string;
    createdAt: string;
  };
  message?: string;
}> => {
  // Try to get payment details first to find orderId
  // This endpoint might not exist - check with backend
  // Alternative: Use getOrderPaymentDetails if you have orderId
  try {
    const res = await apiClient.get(`/payments/${paymentId}`);
    return res.data;
  } catch {
    // If endpoint doesn't exist, throw helpful error
    throw new Error(
      "Cannot get payment status by paymentId. Please use getOrderPaymentStatus with orderId instead.",
    );
  }
};

// Get payment notifications
// Response structure: { success: true, data: { notifications: [...] } }
export const getPaymentNotifications = async (): Promise<{
  success: boolean;
  data: {
    notifications: Array<{
      id: string;
      type:
        | "payment-status-update"
        | "PAYMENT_APPROVED"
        | "PAYMENT_REJECTED"
        | "PAYMENT_PENDING";
      message: string;
      status: "SUCCESS" | "PENDING" | "FAILED";
      amount: number;
      paymentMethod: string;
      orderId?: string | null;
      quoteId?: string;
      timestamp: string;
      paymentId: string;
      read?: boolean;
      createdAt: string;
      metadata?: {
        paymentId: string;
        orderId?: string | null;
        quoteId?: string;
        paymentMethod: string;
      };
    }>;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message?: string;
}> => {
  try {
    const res = await apiClient.get("/notifications/payment-status");
    return res.data;
  } catch {
    // Return empty notifications if endpoint doesn't exist
    console.warn(
      "/notifications/payment-status endpoint not found. Returning empty notifications.",
    );
    return {
      success: true,
      data: {
        notifications: [],
      },
      message: "Notifications endpoint not available",
    };
  }
};

// Mark notification as read
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const res = await apiClient.put(`/notifications/${notificationId}/read`);
  return res.data;
};

// Get payment timeline/events
export const getPaymentTimeline = async (
  paymentId: string,
): Promise<{
  success: boolean;
  data: Array<{
    status: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED" | "COMPLETED";
    timestamp: string;
    message?: string;
    adminNote?: string;
  }>;
  message?: string;
}> => {
  const res = await apiClient.get(`/payments/${paymentId}/timeline`);
  return res.data;
};

// --- QuickBooks Integration API ---

// Initiate QuickBooks OAuth flow
export const initiateQuickBooksOAuth = async (): Promise<{
  success: boolean;
  data: {
    authUrl: string;
    state: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/quickbooks/oauth/initiate");
  return res.data;
};

// Handle QuickBooks OAuth callback
export const handleQuickBooksCallback = async (data: {
  code: string;
  state: string;
  realmId?: string;
}): Promise<{
  success: boolean;
  data: {
    connected: boolean;
    companyName?: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/quickbooks/oauth/callback", data);
  return res.data;
};

// Get QuickBooks connection status
export const getQuickBooksConnectionStatus = async (): Promise<{
  success: boolean;
  data: {
    connected: boolean;
    companyName?: string;
    companyId?: string;
    connectedAt?: string;
  };
  message?: string;
}> => {
  const res = await apiClient.get("/quickbooks/connection/status");
  return res.data;
};

// Get QuickBooks transactions
export const getQuickBooksTransactions = async (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  data: {
    transactions: Array<{
      id: string;
      date: string;
      amount: number;
      description: string;
      type: "INVOICE" | "PAYMENT" | "EXPENSE";
      status: string;
      customerName?: string;
    }>;
    total: number;
    hasMore: boolean;
  };
  message?: string;
}> => {
  const res = await apiClient.get("/quickbooks/transactions", { params });
  return res.data;
};

// Disconnect QuickBooks account
export const disconnectQuickBooks = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  const res = await apiClient.post("/quickbooks/disconnect");
  return res.data;
};

// Create QuickBooks invoice for a quote
export const createQuickBooksInvoice = async (data: {
  quoteId: string;
  amount: number;
}): Promise<{
  success: boolean;
  data: {
    invoiceId: string;
    invoiceNumber?: string;
    quickbooksInvoiceId: string;
    status: string;
    paymentId: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/quickbooks/invoice/create", data);
  return res.data;
};

// Sync QuickBooks transactions manually
export const syncQuickBooksTransactions = async (): Promise<{
  success: boolean;
  data: {
    syncedCount: number;
    lastSyncAt: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/quickbooks/sync");
  return res.data;
};

// Get QuickBooks invoice payment status
export const getQuickBooksInvoiceStatus = async (
  invoiceId: string,
): Promise<{
  success: boolean;
  data: {
    invoiceId: string;
    quickbooksInvoiceId: string;
    status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
    amount: number;
    amountPaid: number;
    amountDue: number;
    dueDate?: string;
    paidDate?: string;
  };
  message?: string;
}> => {
  const res = await apiClient.get(`/quickbooks/invoice/${invoiceId}/status`);
  return res.data;
};

// --- Admin QuickBooks API Functions ---

export interface QuickBooksConnection {
  userId: string;
  userName: string;
  userEmail: string;
  companyId: string;
  connectedAt: string;
  expiresAt: string | null;
  isExpired: boolean;
  recentPayments: number;
  lastPaymentSync: string | null;
}

export interface QuickBooksSyncStatus {
  total: number;
  statusCounts: {
    SYNCED: number;
    PENDING: number;
    FAILED: number;
    NOT_SYNCED: number;
  };
  payments: Array<{
    paymentId: string;
    userId: string;
    userName: string;
    userEmail: string | null;
    quoteId: string | null;
    amount: number;
    status: string;
    syncStatus: string;
    invoiceId: string | null;
    lastSyncAt: string | null;
    createdAt: string;
  }>;
}

export interface QuickBooksSyncError {
  paymentId: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  quoteId: string | null;
  amount: number;
  invoiceId: string | null;
  lastSyncAttempt: string | null;
  createdAt: string;
  error: string;
}

export interface MapTransactionRequest {
  transactionId: string;
  orderId: string;
}

// Get all QuickBooks connections (admin)
export const getAdminQuickBooksConnections = async (): Promise<{
  success: boolean;
  data: QuickBooksConnection[];
  message?: string;
}> => {
  const res = await apiClient.get("/admin/quickbooks/connections");
  return res.data;
};

// Get QuickBooks sync status (admin)
export const getAdminQuickBooksSyncStatus = async (): Promise<{
  success: boolean;
  data: QuickBooksSyncStatus;
  message?: string;
}> => {
  const res = await apiClient.get("/admin/quickbooks/sync-status");
  return res.data;
};

// Manual sync for specific payment (admin)
export const syncAdminQuickBooksPayment = async (
  paymentId: string,
): Promise<{
  success: boolean;
  data: {
    paymentId: string;
    invoiceId: string;
    syncStatus: string;
    paymentStatus: string;
    syncedAt: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post(`/admin/quickbooks/sync/${paymentId}`);
  return res.data;
};

// Get QuickBooks sync errors (admin)
export const getAdminQuickBooksErrors = async (): Promise<{
  success: boolean;
  data: QuickBooksSyncError[];
  message?: string;
}> => {
  const res = await apiClient.get("/admin/quickbooks/errors");
  return res.data;
};

// Get all QuickBooks transactions (admin)
export const getAdminQuickBooksTransactions = async (): Promise<{
  success: boolean;
  data: {
    transactions: unknown[];
    count: number;
  };
  message?: string;
}> => {
  const res = await apiClient.get("/admin/quickbooks/transactions");
  return res.data;
};

// Get unmapped QuickBooks transactions (admin)
export const getAdminQuickBooksUnmappedTransactions = async (): Promise<{
  success: boolean;
  data: {
    transactions: unknown[];
    count: number;
  };
  message?: string;
}> => {
  const res = await apiClient.get("/admin/quickbooks/unmapped-transactions");
  return res.data;
};

// Map QuickBooks transaction to order (admin)
export const mapAdminQuickBooksTransaction = async (
  data: MapTransactionRequest,
): Promise<{
  success: boolean;
  data: {
    transactionId: string;
    orderId: string;
    paymentId: string;
    mappedAt: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/admin/quickbooks/map-transaction", data);
  return res.data;
};

// Retry all failed syncs (admin)
export const retryAdminQuickBooksFailedSyncs = async (): Promise<{
  success: boolean;
  data: {
    attempted: number;
    succeeded: number;
    failed: number;
    errors: Array<{ paymentId: string; error: string }>;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/admin/quickbooks/retry-failed-syncs");
  return res.data;
};

// --- Admin Payment Transactions API ---

export interface TransactionFilters {
  method?: "QUICKBOOKS" | "STRIPE" | "MANUAL";
  status?: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaymentTransaction {
  paymentId: string;
  transactionId: string;
  method: "QUICKBOOKS" | "STRIPE" | "MANUAL";
  status: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  amount: number;
  paidAt: string | null;
  createdAt: string;
  customer: string;
  customerEmail: string | null;
  userId: string | null;
  quoteId: string | null;
  orderId: string | null;
  orderTotal: number | null;
  totalCoins: number | null;
  coinDesignName: string | null;
  quickbooksInvoiceId: string | null;
  quickbooksSyncStatus: string | null;
  quickbooksLastSyncAt: string | null;
  stripeCheckoutSessionId: string | null;
  stripeCustomerId: string | null;
  paymentProof: string | null;
  receiptUrl: string | null;
}

export interface PaymentTransactionsResponse {
  transactions: PaymentTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalTransactions: number;
    byMethod: {
      QUICKBOOKS: number;
      STRIPE: number;
      MANUAL: number;
    };
    byStatus: {
      SUCCESS: number;
      PENDING: number;
      FAILED: number;
      REFUNDED: number;
    };
  };
}

// Get admin payment transactions
export const getAdminPaymentTransactions = async (
  filters?: TransactionFilters,
): Promise<{
  success: boolean;
  data: PaymentTransactionsResponse;
  message?: string;
}> => {
  const params = new URLSearchParams();

  if (filters?.method) params.append("method", filters.method);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);

  const queryString = params.toString();
  const url = `/admin/quickbooks/payment-transactions${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await apiClient.get(url);
  return res.data;
};

// --- QuickBooks Integration API (Guide-compatible endpoints) ---

// Get QuickBooks connection status (guide endpoint: GET /api/quickbooks/status)
export const getQuickBooksStatus = async (): Promise<{
  success: boolean;
  data: {
    connected: boolean;
    expired: boolean;
    connectedAt?: string;
    expiresAt?: string;
  };
  message?: string;
}> => {
  const res = await apiClient.get("/quickbooks/status");
  return res.data;
};

// Initiate QuickBooks connection (guide endpoint: GET /api/quickbooks/connect)
export const connectQuickBooks = async (): Promise<{
  success: boolean;
  data: {
    authUri: string;
  };
  message?: string;
}> => {
  const res = await apiClient.get("/quickbooks/connect");
  return res.data;
};

// Create QuickBooks invoice (guide endpoint: POST /api/quickbooks/invoice/create)
export const createQuickBooksInvoiceForQuote = async (data: {
  quoteId: string;
  amount: number;
  customerEmail: string;
  customerName?: string;
}): Promise<{
  success: boolean;
  data: {
    paymentId: string;
    invoiceId: string;
    message: string;
  };
  message?: string;
}> => {
  const res = await apiClient.post("/quickbooks/invoice/create", data);
  return res.data;
};
