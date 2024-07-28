import { useState } from "react";
import {Rating} from "./index";
import classes from "./css/userGameInfo.module.css";
import useFetch from "../useFetch";
import {useAppContext} from "../context/appContext";
import axios from "axios";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { FaListUl, FaListCheck } from "react-icons/fa6";

const UserGameInfo = ({gameId}) => {
  const {user} = useAppContext();
  const [dataUpdated,setDataUpdated] = useState(false);

  if (!user){
    return <div>Login to be able to rate and add to lists</div>
  }

  const {data:userInfo,isLoading:userInfoLoading} = useFetch({url:`/users/${user?.username}/games/${gameId}`},[dataUpdated]);

  const addToList = async (listName) => {
    try {
      await axios.post(`/lists/${listName}/games`, 
        {game_id:gameId},
        {headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }});
        setDataUpdated(!dataUpdated);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteFromlist = async (listName) => {
    try {
      await axios.delete(`/lists/${listName}/games/${gameId}`,
        {headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }});
        setDataUpdated(!dataUpdated);
    } catch (error) {
      console.log(error);
    }
  }

  if (userInfoLoading) return;

  return (
    <div className={classes.container}>
      { userInfo.played ?
        (
          <IoGameController 
            size={30} 
            className={classes.controller}
            onClick={()=>deleteFromlist("played")}
          />
        )
        :
        (
          <IoGameControllerOutline
            size={30}
            className={classes.controller}
            onClick={()=>addToList("played")}
          />
        )}
      <Rating 
        className={classes.userRating} 
        isInteractable 
        userRating={userInfo.rating} 
        gameId={gameId} size={30}
      />
      { userInfo.wishlisted ?
        (
          <FaListCheck
            className={classes.wishlist}
            size={20}
            onClick={()=>deleteFromlist("wishlist")}
          />
        )
        :
        (
          <FaListUl 
            className={classes.wishlist}
            size={20}
            onClick={()=>addToList("wishlist")}
          />
        )}
    </div>
  )
}
export default UserGameInfo