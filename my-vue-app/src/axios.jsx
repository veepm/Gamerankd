import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
//axios.defaults.headers.common["Authorization"] = localStorage.getItem("accessToken");

axios.interceptors.response.use(
  response => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      await axios("/auth/refresh",{method:"post",withCredentials:true});
      return axios(prevRequest);
    }
    return Promise.reject(error);
  }
)