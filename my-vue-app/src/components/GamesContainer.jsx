import {Loading} from "./index";
import useFetch from "../useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import classes from "./css/gamesContainer.module.css";

const sortOptions = ["popularity","a-z","z-a","highestRated","lowestRated","latest","oldest"];

const GamesContainer = ({gameIds,gameCount}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  let filteredGenres = searchParams.get("genres")?.split(",").map(Number) || [];
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  let sortBy = searchParams.get("sortBy");

  if (!sortOptions.includes(sortBy)){
    sortBy = "popularity";
  }

  if (filteredGenres.includes(NaN)){
    filteredGenres = filteredGenres.filter(genre => !isNaN(genre));
  }

  let url = `/games?coverSize=cover_big_2x&limit=${gameCount}&page=${page}&sortBy=${sortBy}&fields=cover.url,name`;

  if (search){
    url += `&search=${search}`;
  }
  if (filteredGenres.length > 0){
    url += `&genres=${filteredGenres}`;
  }
  if (gameIds){
    gameIds.forEach(id => {
      url += `&id[]=${id}`;
    });
  }

  const {data,isLoading,error} = useFetch({method:"get", url},[searchParams]);


  return (
    <div className={classes.gamesContainer}>
      {isLoading ?
        [...Array(gameCount)].map(placeholder =>{
          return <div className={classes.placeholder}></div>;
        })
      :
        data.games?.map(game => {
          return (
            <div key={game.id} className={classes.game} onClick={()=>navigate(`/games/${game.id}`)}>
              <img 
                title={game.name}
                className={classes.cover}
                src={game.cover ? `https:${game.cover}` : "../vite.svg"}
                loading="lazy"
              />
              <img
                className={classes.background}
                src={game.cover ? `https:${game.cover}` : "../vite.svg"}
                loading="lazy"
              />
            </div>
          );
        })}
    </div>
  )
};

export default GamesContainer;