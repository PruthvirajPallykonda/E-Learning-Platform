import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:7214/api";

const axiosClient = axios.create({
    baseURL: apiBaseUrl,
});

axiosClient.interceptors.request.use((config) => {
    const savedUser = sessionStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token || user?.Token;

    if(token)
    {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;
