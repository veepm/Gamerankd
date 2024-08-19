import {useQuery} from "@tanstack/react-query";
import {GamesContainer, PageButton, Sort, SearchBar, GenresFilter} from "../components";
import classes from "./css/allGames.module.css";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";

const sortOptions = ["popularity","a-z","z-a","highestRated","lowestRated","latest","oldest"];

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {username, listName} = useParams();

  let filteredGenres = searchParams.get("genres")?.split(",").map(Number) || [];
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  let sortBy = searchParams.get("sortBy");

  if (!sortOptions.includes(sortBy)){
    sortBy = sortOptions[0];
  }

  if (filteredGenres.includes(NaN)){
    filteredGenres = filteredGenres.filter(genre => !isNaN(genre));
  }

  const listGamesQuery = useQuery({
    queryKey: ["users", username, "lists", listName],
    enabled: username != null && listName != null, // Only run for lists route
    queryFn: async () => {
      const {data} = await axios.get(`/users/${username}/lists/${listName}`);
      return data;
    }
  });

  let url = `/games?coverSize=cover_big_2x&limit=48&page=${page}&sortBy=${sortBy}&fields=cover.url,name`;

  if (search){
    url += `&search=${search}`;
  }
  if (filteredGenres.length > 0){
    url += `&genres=${filteredGenres}`;
  }
  if (listGamesQuery?.data?.games.length > 0){
    listGamesQuery.data.games.forEach(id => {
      url += `&id[]=${id}`;
    });
  }

  const allGamesQuery = useQuery({
    queryKey: ["games", {genres:filteredGenres}, {page}, {search}, {sortBy}, {ids:listGamesQuery?.data?.games}],
    enabled: !username && !listName || listGamesQuery?.data?.games.length > 0,
    queryFn: async () => {
      const {data:{games}} = await axios.get(url);
      return games;
    }
  });

  return (
    <div className={classes.container}>
      <header>
        {!username && !listName && <SearchBar placeholder="Search For Games By Title"/>}
        <div className={classes.filters}>
          <Sort/>
          <GenresFilter/>
        </div>
      </header>
      <GamesContainer gamesQuery={allGamesQuery} gameCount={listGamesQuery.data?.games.length || 48}/>
      <PageButton/>
    </div>
  )
};

export default Games;