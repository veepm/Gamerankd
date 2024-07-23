import { useEffect } from "react";
import { useParams } from "react-router-dom"
import {useAppContext} from "../context/appContext";
import {Loading} from "../components/index"
import useFetch from "../useFetch";

const SingleGame = () => {
  const {gameId} = useParams();

  const url = `/games?fields=name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher, involved_companies.developer,involved_companies.company.name,platforms.name&coverSize=cover_big&id=${gameId}`;

  const {data:games,isLoading,error} = useFetch({method:"get",url});

  
  if (isLoading){
    return <Loading></Loading>;
  }
  
  const game = games[0];

  console.log(game);

  return (
    <div className="game">
      <img src={`${game.cover}`}/>
      <div className="info">
        <h2>{game.name}</h2>
        <p>{game.summary}</p>
      </div>
    </div>
  )
}
export default SingleGame