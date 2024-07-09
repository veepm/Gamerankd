import Games from "./Games"
import { useAppContext } from "../context/appContext"
import { useEffect } from "react";
import Loading from "./Loading";
import PageButton from "./PageButton";

const GamesContainer = () => {
  const {isLoading, games, getAllGames} = useAppContext();

  useEffect(()=>{
    getAllGames();
  },[]);

  if (isLoading){
    return <Loading></Loading>;
  }
  
  return (
    <>
      <div className="gamesContainer">
        {!isLoading && games.map(game => {
          return <Games game={game} key={game.id}></Games>;
        })}
      </div>
      <PageButton></PageButton>
    </>
  )
}
export default GamesContainer