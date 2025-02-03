// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from 'react-toastify';

// const refreshAuthToken = async () => {
//   const token = Cookies.get("authToken");
//   const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

//   try {
//     const response = await axios.post(`${apiUrl}/api/refresh-token`, { token });
//     const newToken = response.data.token;

//     Cookies.set("authToken", newToken);
//     return newToken;
//   } catch (error) {
//     toast.error("Session expired. Please log in again.");
//     // Optional: Redirect to login page
//     // window.location.href = '/login';
//     throw error;
//   }
// };

// const axiosInstance = axios.create();

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("authToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newToken = await refreshAuthToken();
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Handle refresh failure (e.g., redirect to login)
//         throw refreshError;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Function to refresh the auth token using the refresh token
export const refreshAuthToken = async () => {
  const refreshToken = Cookies.get('refreshToken'); // Get refresh token from cookies
  
  if (!refreshToken) {
    toast.error("No refresh token found. Please log in again.");
    return null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;
    const response = await axios.post(`${apiUrl}/api/refresh-token`, {
      refresh_token: refreshToken, // Send the refresh token to the backend
    });

    // If successful, save the new tokens to cookies
    const { auth_token, refresh_token } = response.data; // Assuming the response has the tokens
    Cookies.set('authToken', auth_token, { expires: 1 }); // Set the new auth token
    Cookies.set('refreshToken', refresh_token, { expires: 7 }); // Set the new refresh token (optional expiration time)

    return auth_token; // Return the new auth token to be used in your request headers

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle error cases
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to refresh token. Please try again later.');
      }
    } else {
      toast.error('An error occurred while refreshing the token.');
    }
    return null; // Return null in case of failure
  }
};
