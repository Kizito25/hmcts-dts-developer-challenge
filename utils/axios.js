import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// api.interceptors.request.use(
//   (config) => {
//     // e.g. attach token if available
//     const token = localStorage.getItem("token") || null;
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // e.g. handle 401 or log errors
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized, redirect to login?");
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
