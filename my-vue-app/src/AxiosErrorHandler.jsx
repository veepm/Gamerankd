import { useEffect } from "react";
import axios from "axios";
import { useAppContext } from "./context/appContext";

const AxiosErrorHandler = ({ children }) => {
  const { setUser } = useAppContext();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          if (error?.response?.data.msg == "Authentication Invalid") {
            prevRequest.sent = true;
            await axios("/auth/refresh", {
              method: "post",
              data: { refreshToken: localStorage.getItem("refreshToken") },
            });
            return axios(prevRequest);
          } else {
            // ask to login again
            window.location.href = '/';
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [setUser]);

  return children;
};

export default AxiosErrorHandler;
