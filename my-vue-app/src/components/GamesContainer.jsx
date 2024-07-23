import Games from "./Games"
import Loading from "./Loading";
import PageButton from "./PageButton";
import useFetch from "../useFetch";
import { useSearchParams } from "react-router-dom";
import Sort from "./Sort";

const sortOptions = ["popularity","a-z","z-a","highest","lowest","latest","oldest"];

const GamesContainer = () => {
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

  let url = `/games?coverSize=cover_big&limit=30&page=${page}&sortBy=${sortBy}&fields=cover.url`;

  if (search){
    url += `&search=${search}`;
  }
  if (filteredGenres.length > 0){
    url += `&genres=${filteredGenres}`;
  }

  const {data:games,isLoading,error} = useFetch({method:"get", url},[searchParams]);

  if (isLoading){
    return <Loading></Loading>;
  }

  return (
    <>
      <Sort></Sort>
      <div className="gamesContainer">
        {games.map(game => {
          return <Games game={game} key={game.id}></Games>;
        })}
      </div>
      <PageButton></PageButton>
    </>
  )
}
export default GamesContainer