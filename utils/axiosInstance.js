import axios from "axios";
import Cookies from "js-cookie";

// Function to refresh the auth token
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

// Intercept requests to add the Authorization header with the current token
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

// Intercept responses to check for expired token (401) and refresh the token
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response as is if it's successful
  async (error) => {
    const originalRequest = error.config;

    // If the error is a 401 Unauthorized and the request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Flag to prevent infinite retry loop

      try {
        // Attempt to refresh the token
        const newToken = await refreshAuthToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // You might want to redirect the user to login or show an error notification here
        throw refreshError; // Propagate error if token refresh fails
      }
    }

    // Propagate other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
