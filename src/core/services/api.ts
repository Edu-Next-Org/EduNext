import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./token.service";
import Router from "next/router";

const isServer = typeof window === "undefined";

const API_BASE = isServer 
  ? "https://edunext-api.onrender.com/api" 
  : process.env.NEXT_PUBLIC_API_BASE_URL;    


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let failedSubscribers: Array<(err: unknown) => void> = [];

const subscribeToken = (cb: (token: string) => void, errCb: (err: unknown) => void) => {
  refreshSubscribers.push(cb);
  failedSubscribers.push(errCb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
  failedSubscribers = [];
};

const onFailed = (err: unknown) => {
  failedSubscribers.forEach((cb) => cb(err));
  refreshSubscribers = [];
  failedSubscribers = [];
};


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig = error.config as CustomAxiosRequestConfig | undefined;

    if (!originalConfig) return Promise.reject(error);

    if (error.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          subscribeToken(
            (token: string) => {
              if (originalConfig.headers) {
                originalConfig.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(api(originalConfig));
            },
            (err) => {
              reject(err);
            }
          );
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
       
        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = (refreshRes.data && refreshRes.data.accessToken) as string | undefined;

        if (!newAccessToken) throw new Error("No access token returned from refresh");

        setAccessToken(newAccessToken);

        onRefreshed(newAccessToken);

        if (originalConfig.headers) {
          originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalConfig);
      } catch (refreshErr) {
        onFailed(refreshErr);
        clearAccessToken();

      
        try {
        //   await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
        } catch (e) {
          
        }

      
        Router.replace("/auth/login");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;