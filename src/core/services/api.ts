import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

const api = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? "/api"
      : process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(^|;)\s*accessToken\s*=\s*([^;]+)/);
    if (match && match[2]) {
      config.headers.Authorization = `Bearer ${match[2]}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      if (typeof document !== "undefined") {
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post<RefreshResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data?.accessToken;

        if (newAccessToken && typeof document !== "undefined") {
          const isProd = process.env.NODE_ENV === "production";
          document.cookie = `accessToken=${newAccessToken}; path=/; max-age=900; SameSite=Lax${
            isProd ? "; Secure" : ""
          }`;

          api.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError: unknown) {
        if (typeof document !== "undefined") {
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
