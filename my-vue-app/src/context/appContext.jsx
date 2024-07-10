import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react"
import {reducer} from "./reducer"
import {
  GET_GAMES_BEGIN,
  GET_GAMES_DONE,
  GET_GAME_BEGIN,
  GET_GAME_DONE,
  CHANGE_PAGE,
  HANDLE_SEARCH
} from "./actions"

const initialState = {
  isLoading: false,
  isError: false,
  games: [],
  game: null,
  page: 1,
  search: ''
};

const AppContext = createContext();

const AppProvider = ({children}) => {

  const [state, dispatch] = useReducer(reducer,initialState);

  const getGames = async () => {
    const {page, search} = state;
    let url = `http://localhost:3000/games?coverSize=cover_big&limit=20&page=${page}`;

    if (search){
      url += `&search=${search}`;
    }

    dispatch({type:GET_GAMES_BEGIN});
    try {
      const {data} = await axios.get(url);
      dispatch({type:GET_GAMES_DONE, payload:{games:data.data}});
    } catch (error) {
      console.log(error);
    }
  }

  const getGame = async (id) => {
    dispatch({type:GET_GAME_BEGIN});
    try {
      const {data} = await axios.get(`http://localhost:3000/games/${id}?coverSize=cover_big`);
      dispatch({type:GET_GAME_DONE, payload:{game:data.data}});
    } catch (error) {
      console.log(error);
    }
  }

  const changePage = (page) => {
    dispatch({type:CHANGE_PAGE, payload:{page}});
  }

  const handleSearch = (search) => {
    dispatch({type:HANDLE_SEARCH, payload:{search}});
  }

  return <AppContext.Provider value={{
    ...state,
    getGames,
    getGame,
    changePage,
    handleSearch
  }}>
    {children}
  </AppContext.Provider>
};

const useAppContext = () => {
  return useContext(AppContext);
};

export {AppProvider, useAppContext}