import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/", // Your backend port
  baseURL: "https://expense-tracker-server-2956.onrender.com",
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
