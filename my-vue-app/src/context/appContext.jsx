import axios from "axios";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isUserLoading, setIsUserLoading] = useState(false);

  const setupUser = async (login, values) => {
    try {
      setIsUserLoading(true);
      const url = login ? "/auth/login" : "/auth/register";
      const { data } = await axios.post(url, values, { withCredentials: true });
      if (login) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
      }
    } catch (error) {
      return error;
    } finally {
      setIsUserLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
        setupUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
