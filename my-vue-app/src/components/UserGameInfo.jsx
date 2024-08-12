import { useState, memo } from "react";
import {Rating} from "./index";
import classes from "./css/userGameInfo.module.css";
import axios from "axios";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { PiListBulletsLight, PiListChecksLight } from "react-icons/pi";

const UserGameInfo = ({gameId, userRating, setUserRating, userPlayed, userWishlisted}) => {
  const [isPlayed,setIsPlayed] = useState(userPlayed);
  const [isWishlisted,setIsWishlisted] = useState(userWishlisted);

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
      
      return (
        <div className={classes.container}>
          <button onClick={isPlayed ? ()=>deleteFromlist("played") : ()=>addToList("played")}>
            { isPlayed ? <IoGameController/> : <IoGameControllerOutline/>}
          </button>
          <Rating 
            isInteractable 
            userRating={userRating}
            setUserRating={setUserRating} 
            gameId={gameId}
          />
          <button onClick={isWishlisted ? ()=>deleteFromlist("wishlist") : ()=>addToList("wishlist")}>            
            { isWishlisted ? <PiListChecksLight/> : <PiListBulletsLight/> }
          </button>
    </div>
  )
};

export default memo(UserGameInfo);