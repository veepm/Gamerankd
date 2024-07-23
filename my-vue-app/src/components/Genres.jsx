import { useSearchParams } from "react-router-dom";
import useFetch from "../useFetch"


const Genres = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let filteredGenres = searchParams.get("genres")?.split(",").map(Number) || [];

  const {data:genres,isLoading,error} = useFetch({method:"get",url:"/genres?sort=asc"})

  if (filteredGenres.includes(NaN)){
    filteredGenres = filteredGenres.filter(genre => !isNaN(genre));
  }

  const handleToggle = (e) => {
    const checked = e.target.checked;
    const genreId = Number(e.target.id.split("genreBox")[1]);

    if (checked){
      filteredGenres = [...filteredGenres, genreId];
    }
    else {
      filteredGenres = filteredGenres.filter((genre) => genre !== genreId);
    }

    if (filteredGenres.length > 0){
      searchParams.set("genres", filteredGenres);
    }
    else {
      searchParams.delete("genres");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  }

  if (isLoading) return

  return (
    <ul>
    {genres.map((genre) => {
      return (
      <li key={genre.id}>
        <label htmlFor={`genreBox${genre.id}`}>
          <input type="checkbox" name={genre.name} id={`genreBox${genre.id}`} checked={filteredGenres.includes(genre.id)} onChange={handleToggle}/>
          {genre.name}
        </label>
      </li>)
    })}
    </ul>
  )
}
export default Genres