import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const refreshAuthToken = async () => {
  const token = Cookies.get("authToken");
  const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

  try {
    const response = await axios.post(`${apiUrl}/api/refresh-token`, { token });
    const newToken = response.data.token;

    Cookies.set("authToken", newToken);
    return newToken;
  } catch (error) {
    toast.error("Session expired. Please log in again.");
    // Optional: Redirect to login page
    // window.location.href = '/login';
    throw error;
  }
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., redirect to login)
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;