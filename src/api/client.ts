import axios from "axios";

/**
 * Axios instance pre-configured with the API base URL.
 * All API calls go through this client for consistent config.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Response interceptor for consistent error handling ──
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isLogo404 =
      error.response?.status === 404 &&
      error.config?.url?.match(/\/anime\/.*\/logo/);

    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred";

    const isCanceled = error.name === "CanceledError" || error.message === "canceled";

    if (!isLogo404 && !isCanceled) {
      console.error("[API Error]", message);
    }

    return Promise.reject(new Error(message));
  },
);

export default client;
