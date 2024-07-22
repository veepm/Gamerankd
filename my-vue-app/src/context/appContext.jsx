import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react"
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

  const [state, dispatch] = useReducer(reducer,initialState);

  const setupUser = async (url,values) => {

    dispatch({type:USER_SETUP_BEGIN});

    try {
      const {data} = await axios.post(url,values);
      dispatch({type:USER_SETUP_DONE,payload:data});
    } catch (error) {
      
    }
  }

  return <AppContext.Provider value={{
    ...state,
    setupUser,
  }}>
    {children}
  </AppContext.Provider>
};

const useAppContext = () => {
  return useContext(AppContext);
};

export {AppProvider, useAppContext}