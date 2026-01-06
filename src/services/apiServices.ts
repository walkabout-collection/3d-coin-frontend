import { Api } from "./api/apiTypes";
import apiClient from "./axiosInstance";

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
// submit design

export const createDesign = async (
  data: Parameters<typeof api.design.createCreate>[0],
): Promise<Awaited<ReturnType<typeof api.design.createCreate>>> => {
  const res = await apiClient.post("/design/create", data);

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

// get all quote admin
export const getAdminQuotes = async (): Promise<
  Awaited<ReturnType<typeof api.quote.adminList>>["data"]
> => {
  const res = await apiClient.get("/quote/admin", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data.data;
};

export const getUserQuotes = async (): Promise<
  Awaited<ReturnType<typeof api.quote.userList>>["data"]
> => {
  const res = await apiClient.get("/quote/user", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data.data;
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
  amount: number,
): Promise<
  Awaited<ReturnType<typeof api.quote.adminApproveCreate>>["data"]
> => {
  const res = await apiClient.post(`/quote/admin/${id}/approve`, { amount });
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

export const getUserOrders = async (): Promise<
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
  orderId: string;
  amount: number;
  method: "MANUAL" | "STRIPE" | "QUICKBOOKS";
}): Promise<void> => {
  await apiClient.post("/order/user/payment/create", data);
};
