// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default apiClient;

import axios from "axios";
const refreshAccessToken = async () => {
  const refreshToken = getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api"}/auth/refresh-token`,
    { refreshToken },
  );

  const { accessToken, refreshToken: newRefreshToken } = res.data.data;

  if (!accessToken || !newRefreshToken) {
    throw new Error("Failed to refresh access token");
  }

  setCookie("token", accessToken, 86400); // 1 day
  setCookie("refreshToken", newRefreshToken, 604800); // 7 days

  return accessToken;
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

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api",
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
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
