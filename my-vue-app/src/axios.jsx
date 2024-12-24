import axios from "axios";

axios.defaults.baseURL = "https://api-gamerankd.onrender.com";
// axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Authorization"] =
  localStorage.getItem("accessToken");

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (
      error?.response?.status === 401 &&
      error?.response?.data.msg == "Authentication Invalid" &&
      !prevRequest?.sent
    ) {
      prevRequest.sent = true;
      await axios("/auth/refresh", {
        method: "post",
        data: { refreshToken: localStorage.getItem("refreshToken") },
      });
      return axios(prevRequest);
    }
    return Promise.reject(error);
  }
);
