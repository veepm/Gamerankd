import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react"

const AppContext = createContext();

const AppProvider = ({children}) => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isUserLoading, setIsUserLoading] = useState(false);

  const setupUser = async (url,values) => {
    try {
      setIsUserLoading(true);
      const {data} = await axios.post(url,values,{withCredentials:true});
      localStorage.setItem("user",JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsUserLoading(false);
    }
  }

  const logoutUser = async () => {
    try {
      await axios.post("/auth/logout",undefined,{withCredentials:true});
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
  }

  return <AppContext.Provider value={{
    user,
    isUserLoading,
    setupUser,
    logoutUser
  }}>
    {children}
  </AppContext.Provider>
};

const useAppContext = () => {
  return useContext(AppContext);
};

export {AppProvider, useAppContext}