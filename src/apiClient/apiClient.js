import axios from "axios";
const BASE_URL = "http://localhost:3001";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const services = {
  get: (endpoint, config = {}) => axiosInstance.get(endpoint, config),
  post: (endpoint, data, config = {}) =>
    axiosInstance.post(endpoint, data, config),
  put: (endpoint, data, config = {}) =>
    axiosInstance.put(endpoint, data, config),
  patch: (endpoint, data, config = {}) =>
    axiosInstance.patch(endpoint, data, config),
  delete: (endpoint, config = {}) => axiosInstance.delete(endpoint, config),
};
