import {Games, Loading, PageButton, Sort} from "./index";
import useFetch from "../useFetch";
import { useSearchParams } from "react-router-dom";
import classes from "./css/gamesContainer.module.css";

const sortOptions = ["popularity","a-z","z-a","highest","lowest","latest","oldest"];

const GamesContainer = ({gameIds}) => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  let url = `/games?coverSize=cover_big_2x&limit=30&page=${page}&sortBy=${sortBy}&fields=cover.url,name`;

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

  if (isLoading){
    return <Loading></Loading>;
  }

  return (
    <div className={classes.gamesContainer}>
      {data.games?.map(game => {
        return <Games game={game} key={game.id}></Games>;
      })}
    </div>
  )
};

export default GamesContainer;