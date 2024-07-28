import {
  USER_SETUP_DONE,
  USER_SETUP_BEGIN
} from "./actions"

export const reducer = (state, action) => {
  
  if (action.type === USER_SETUP_BEGIN){
    return {...state, isLoading:true};
  }

  if (action.type === USER_SETUP_DONE){
    return {...state, user:action.payload.username, isLoading:false};
  }

}