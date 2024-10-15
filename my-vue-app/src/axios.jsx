import axios from "axios";

axios.defaults.baseURL = "https://api-gamerankd.onrender.com";
// axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      await axios("/auth/refresh", { method: "post", withCredentials: true });
      return axios(prevRequest);
    }
    return Promise.reject(error);
  }
);
