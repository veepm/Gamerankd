import { useState, memo } from "react";
import {Rating} from "./index";
import classes from "./css/userGameInfo.module.css";
import axios from "axios";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { PiListBulletsLight, PiListChecksLight } from "react-icons/pi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appContext";

const UserGameInfo = ({gameId, userRating, setUserRating, userPlayed, userWishlisted}) => {
  const {user} = useAppContext();
  const queryClient = useQueryClient();

  const [isPlayed,setIsPlayed] = useState(userPlayed);
  const [isWishlisted,setIsWishlisted] = useState(userWishlisted);

  const addGameMutation = useMutation({
    mutationFn: (listName) => axios.post(`/lists/${listName}/games`, {game_id:gameId}, {withCredentials:true}),
    onSuccess: (data, listName) => {
      // queryClient.setQueryData(["users", user.username, "lists", variables], (oldData) => {
      //   if (oldData){
      //     return {...oldData, games:[...oldData.games, gameId]};
      //   }
      //   return oldData;
      // });
      queryClient.invalidateQueries({queryKey:["users", user?.username, "games", gameId]});
      queryClient.invalidateQueries({queryKey: ["users", user.username, "lists", listName], refetchType:"all"});
      listName === "played" ? setIsPlayed(true) : setIsWishlisted(true);
    }
  });

  const deleteGameMutation = useMutation({
    mutationFn: (listName) => axios.delete(`/lists/${listName}/games/${gameId}`,{withCredentials:true}),
    onSuccess: (data, listName) => {
      // queryClient.setQueryData(["users", user.username, "lists", variables], (oldData) => {
      //   if (oldData){
      //     return {...oldData, games:oldData.games.filter((game) => game!=gameId)};
      //   }
      //   return oldData;
      // });
      queryClient.invalidateQueries({queryKey:["users", user?.username, "games", gameId]});
      queryClient.invalidateQueries({queryKey: ["users", user.username, "lists", listName], refetchType:"all"});
      listName === "played" ? setIsPlayed(false) : setIsWishlisted(false)
    }
  });
      
  return (
    <div className={classes.container}>
      <button onClick={isPlayed ? () => deleteGameMutation.mutate("played") : () => addGameMutation.mutate("played")}>
        { isPlayed ? <IoGameController/> : <IoGameControllerOutline/>}
      </button>
      <Rating 
        isInteractable 
        userRating={userRating}
        setUserRating={setUserRating} 
        gameId={gameId}
      />
      <button onClick={isWishlisted ? () => deleteGameMutation.mutate("wishlist") : () => addGameMutation.mutate("wishlist")}>            
        { isWishlisted ? <PiListChecksLight/> : <PiListBulletsLight/> }
      </button>
    </div>
  )
};

export default memo(UserGameInfo);