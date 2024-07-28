import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react"
import {reducer} from "./reducer"
import {
  USER_SETUP_DONE,
  USER_SETUP_BEGIN
} from "./actions"

const initialState = {
  user: null,
};

axios.defaults.baseURL = "http://localhost:3000";

const AppContext = createContext();

const AppProvider = ({children}) => {

  const [user, setUser] = useState(null);

  //const [state, dispatch] = useReducer(reducer,initialState);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);


  const setupUser = async (url,values) => {

    //dispatch({type:USER_SETUP_BEGIN});

    try {
      const {data} = await axios.post(url,values);
      localStorage.setItem("user",JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.token);
      setUser(data.user);
      //dispatch({type:USER_SETUP_DONE,payload:data});
    } catch (error) {
      console.log(error);
    }
  }

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }

  return <AppContext.Provider value={{
    user,
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