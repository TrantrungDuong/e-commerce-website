import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
});

// ✅ Log: request đi kèm accessToken
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        console.log("📤 Sending request with access token:", token.slice(0, 30) + "...");
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log("⚠️ No access token found for request.");
    }
    return config;
});

// ✅ Tự động refresh token khi gặp 401
axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("⛔ Access token expired. Trying to refresh...");

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    console.warn("❌ No refresh token found. Redirecting to login.");
                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(err);
                }

                console.log("🔁 Sending refresh token:", refreshToken.slice(0, 30) + "...");
                const res = await axiosInstance.post("/mobile-shop/auth/refresh", {
                    token: refreshToken,
                });

                const newToken = res.data.result.token;
                console.log("✅ Received new access token:", newToken.slice(0, 30) + "...");

                localStorage.setItem("accessToken", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return axiosInstance(originalRequest); // Retry original request
            } catch (e) {
                console.error("❌ Refresh token failed. Logging out.");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default axiosInstance;
