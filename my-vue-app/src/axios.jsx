import axios from "axios";

axios.defaults.baseURL = "https://api-gamerankd.onrender.com";
// axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use( (config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization =  token;
  return config;
});

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
      const { data : {accessToken, refreshToken} } = await axios("/auth/refresh", {
        method: "post",
        data: { refreshToken: localStorage.getItem("refreshToken") },
      }); 
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return axios(prevRequest);
    }
    return Promise.reject(error);
  }
);
