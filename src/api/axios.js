import axios from "axios";

const api = axios.create({
  baseURL: "https://apis.allsoft.co/api/documentManagement",
});

// Add token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["token"] = token;
  }
  return config;
});

export default api;
