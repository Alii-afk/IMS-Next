import axios from "axios";
import Cookies from "js-cookie";


const refreshAuthToken = async () => {
    const token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

  try {
    const response = await axios.post(`${apiUrl}/api/refresh-token`, { token });
    const newToken = response.data.token; // Assuming the response contains the new token
    Cookies.set("authToken", newToken); // Store the new token in cookies
    return newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Propagate error if token refresh fails
  }
};

// Create a custom axios instance
const axiosInstance = axios.create();

// Intercept requests to check for expired token and retry request with refreshed token
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

// Intercept responses to check for 401 status and refresh token if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to token expiration (status 401), attempt to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw refreshError; // Propagate error if refresh fails
      }
    }

    // Propagate other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
