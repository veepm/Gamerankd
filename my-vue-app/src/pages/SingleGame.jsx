import { useEffect } from "react";
import { useParams } from "react-router-dom"
import {useAppContext} from "../context/appContext";
import {Loading} from "../components/index"

const SingleGame = () => {
  const {game, getGame, isLoading} = useAppContext();
  const {gameId} = useParams();

  useEffect(()=>{
    getGame(gameId)
  },[]);

  if (isLoading){
    return <Loading></Loading>;
  }

  return (
    <img src={`${game?.cover}`}/>
  )
}
export default SingleGame