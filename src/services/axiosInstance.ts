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
  if (!refreshToken) throw new Error("No refresh token found");

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api"}/auth/refresh-token`,
    { refreshToken }
  );

  const { accessToken, refreshToken: newRefreshToken } = res.data;
  console.log("Refreshed access token:", accessToken);
  console.log("Refreshed refresh token:", newRefreshToken);
  console.log("Refreshed token response:", res.data);

  if (!accessToken || !newRefreshToken) {
    throw new Error("Failed to refresh access token");
  }

  // Update cookies
  document.cookie = `token=${accessToken}; path=/; max-age=86400`;
  document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800`;

  return accessToken;
};

// Helper: cookie parser
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
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

   if (error.response?.status === 401 && !(originalRequest as any)._retry) {
  (originalRequest as any)._retry = true;


      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); 
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
