
import axios from "axios";
import { getToken, setToken, clearAllAuthData } from "./localStorageService";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const oldAccessToken = getToken();

                if (!oldAccessToken) {
                    clearAllAuthData();
                    window.location.href = "/login";
                    return Promise.reject(err);
                }
                const refreshRes = await axiosInstance.post("/mobile-shop/auth/refresh", {
                    token: oldAccessToken,
                });

                const newAccessToken = refreshRes.data.result.token;

                setToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                clearAllAuthData();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;