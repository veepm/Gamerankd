import {
  GET_GAMES_BEGIN,
  GET_GAMES_DONE,
  GET_GAME_BEGIN,
  GET_GAME_DONE,
  CHANGE_PAGE,
  HANDLE_SEARCH
} from "./actions"

export const reducer = (state, action) => {
  if (action.type === GET_GAMES_BEGIN){
    return {...state, isLoading:true};
  }

  if (action.type === GET_GAMES_DONE){
    return {...state, games:action.payload.games, isLoading:false};
  }

  if (action.type === GET_GAME_BEGIN){
    return {...state, isLoading:true};
  }

  if (action.type === GET_GAME_DONE){
    return {...state, isLoading:false, game:action.payload.game};
  }

  if (action.type === CHANGE_PAGE){
    return {...state, page:action.payload.page};
  }

  if (action.type == HANDLE_SEARCH){
    return {...state, search:action.payload.search, page:1};
  }
}