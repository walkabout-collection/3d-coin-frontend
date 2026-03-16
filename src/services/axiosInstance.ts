// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default apiClient;

import axios from "axios";

// Get API base URL based on environment
const getApiBaseUrl = () => {
  // Allow environment variable to override
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Use production URL in production builds
  if (process.env.NODE_ENV === "production") {
    return "https://api.legacyforgecoins.com/api";
  }
  // Default to localhost for development
  return "http://localhost:8000/api";
};

const refreshAccessToken = async () => {
  const refreshToken = getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const res = await axios.post(`${getApiBaseUrl()}/auth/refresh-token`, {
      refreshToken,
    });

    // Check if response indicates success
    if (res.status === 401 || !res.data?.data) {
      throw new Error("Refresh token expired or invalid");
    }

    const { accessToken, refreshToken: newRefreshToken } = res.data.data;

    if (!accessToken || !newRefreshToken) {
      throw new Error("Failed to refresh access token");
    }

    setCookie("token", accessToken, 86400); // 1 day
    setCookie("refreshToken", newRefreshToken, 604800); // 7 days

    return accessToken;
  } catch (error: unknown) {
    // If refresh token itself is invalid (401), clear auth
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      error.response.status === 401
    ) {
      clearAuthAndNotify();
      throw new Error("Refresh token expired. Please log in again.");
    }
    throw error;
  }
};

// Helper: cookie parser
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift() || null;
    // Decode URI component in case the cookie value was encoded
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

// Helper: set cookie
const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document === "undefined") return;
  // Encode the value to handle special characters
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

// Helper: delete cookie
const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
};

// Helper: clear auth cookies and notify app
const clearAuthAndNotify = () => {
  if (typeof document === "undefined") return;
  deleteCookie("token");
  deleteCookie("refreshToken");
  // Dispatch event to notify app of auth change
  window.dispatchEvent(new Event("authChanged"));
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        // refreshAccessToken already clears auth if refresh token is invalid
        // Just reject with a user-friendly error message
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Authentication expired. Please log in again.";
        return Promise.reject(new Error(errorMessage));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
