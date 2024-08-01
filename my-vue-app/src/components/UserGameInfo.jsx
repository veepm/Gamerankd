import { useEffect, useState } from "react";
import {Rating} from "./index";
import classes from "./css/userGameInfo.module.css";
import useFetch from "../useFetch";
import {useAppContext} from "../context/appContext";
import axios from "axios";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { FaListUl, FaListCheck } from "react-icons/fa6";

const UserGameInfo = ({gameId}) => {
  const {user} = useAppContext();
  const [isPlayed,setIsPlayed] = useState();
  const [isWishlisted,setIsWishlisted] = useState();

  // if (!user){
  //   return <div>Login to be able to rate and add to lists</div>
  // }

  const {data:userInfo,isLoading:userInfoLoading} = useFetch({url:`/users/${user?.username}/games/${gameId}`});

  
  const addToList = async (listName) => {
    try {
      await axios.post(`/lists/${listName}/games`, {game_id:gameId}, {withCredentials:true});
      
      listName === "played" ? setIsPlayed(true) : setIsWishlisted(true);
      
      } catch (error) {
        console.log(error);
      }
    }
    
    const deleteFromlist = async (listName) => {
      try {
        await axios.delete(`/lists/${listName}/games/${gameId}`,{withCredentials:true});
          
        listName === "played" ? setIsPlayed(false) : setIsWishlisted(false);

        } catch (error) {
          console.log(error);
        }
      }
      
      useEffect(() => {
        setIsPlayed(userInfo?.played);
        setIsWishlisted(userInfo?.wishlisted);
      },[userInfo])

      if (userInfoLoading) return;
      
      return (
        <div className={classes.container}>
      { isPlayed ?
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
      { isWishlisted ?
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