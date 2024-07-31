import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_DEV
const api = axios.create({
  baseURL: API_URL + '/api',
});


api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("userData")).access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && [401].includes(error.response.status)) {
      const redirectUrl = error.response.headers.location;
      return api.get(redirectUrl);
    }
    return Promise.reject(error);
  }
);
export default api;
