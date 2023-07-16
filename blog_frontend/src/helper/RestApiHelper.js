import axios from "axios";
import AuthHelper from "./AuthHelper";

//const BLOG_SERVICE_ENDPOINT_DEV = "http://localhost:3000"
//const BLOG_SERVICE_ENDPOINT_PROD = "http://localhost:3000"

const api = axios.create({
    baseURL: 'http://localhost:3000/api/'
})

// Add an interceptor to conditionally include the bearer token
api.interceptors.request.use((config) => {
    
    if (config.headers.requireToken) {
      const token = AuthHelper.getAuth().accessToken;
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });

export default api;