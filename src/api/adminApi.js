import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8000/api/admin", // your PHP backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically for future requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;