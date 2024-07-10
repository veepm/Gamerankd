import {
  GET_GAMES_BEGIN,
  GET_GAMES_DONE,
  GET_GAME_BEGIN,
  GET_GAME_DONE,
  CHANGE_PAGE,
  HANDLE_CHANGE,
  RESET_INPUT,
  GET_GENRES_DONE
} from "./actions"

export const reducer = (state, action) => {
  if (action.type === GET_GAMES_BEGIN){
    return {...state, isLoading:true};
  }

  if (action.type === GET_GAMES_DONE){
    return {...state, games:action.payload.games, isLoading:false};
  }

  if (action.type === GET_GAME_BEGIN){
    console.log("here");
    return {...state, isLoading:true};
  }

  if (action.type === GET_GAME_DONE){
    return {...state, isLoading:false, game:action.payload.game};
  }
  
  if (action.type === GET_GENRES_DONE){
    return {...state, isLoading:false, genres:action.payload.genres};
  }

  if (action.type === CHANGE_PAGE){
    return {...state, page:action.payload.page};
  }

  if (action.type === HANDLE_CHANGE){
    return {...state, [action.payload.name]:action.payload.value, page:1};
  }

  if (action.type === RESET_INPUT){
    return {...state, search:"", filteredGenres:[], games:[]}; // resets games so that old games aren't rendered when remounting page
  }

}