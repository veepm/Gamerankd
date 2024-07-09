import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react"
import {reducer} from "./reducer"
import {
  GET_GAMES_BEGIN,
  GET_GAMES_DONE,
  GET_GAME_BEGIN,
  GET_GAME_DONE,
  CHANGE_PAGE
} from "./actions"

const initialState = {
  isLoading: false,
  isError: false,
  games: [],
  game: null,
  page: 1
};

const AppContext = createContext();

const AppProvider = ({children}) => {

  const [state, dispatch] = useReducer(reducer,initialState);

  const getAllGames = async () => {
    dispatch({type:GET_GAMES_BEGIN});
    try {
      const games = await axios.get("http://localhost:3000/games?coverSize=cover_big&limit=20");
      dispatch({type:GET_GAMES_DONE, payload:{games:games.data.data}});
    } catch (error) {
      console.log(error);
    }
  }

  const getGame = async (id) => {
    dispatch({type:GET_GAME_BEGIN});
    try {
      const game = await axios.get(`http://localhost:3000/games/${id}?coverSize=cover_big`);
      dispatch({type:GET_GAME_DONE, payload:{game:game.data.data}});
    } catch (error) {
      console.log(error);
    }
  }

  const changePage = async (page) => {
    //dispatch({type:"CHANGE_PAGE_BEGIN"});
    try {
      const games = await axios.get(`http://localhost:3000/games?coverSize=cover_big&limit=20&page=${page}`);
      dispatch({type:CHANGE_PAGE, payload:{games:games.data.data, page}});
    } catch (error){
      console.log(error);
    }
  }

  return <AppContext.Provider value={{
    ...state,
    getAllGames,
    getGame,
    changePage
  }}>
    {children}
  </AppContext.Provider>
};

const useAppContext = () => {
  return useContext(AppContext);
};

export {AppProvider, useAppContext}