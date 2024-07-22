import { useSearchParams } from "react-router-dom";
import useFetch from "../useFetch";

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {data:genres,isLoading,error} = useFetch({method:"get",url:"/genres?sort=asc"})

  let filteredGenres = searchParams.get("genres")?.split(",").map(Number) || [];

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

  if (isLoading){
    return
  }

  return (
    <form action="" className="filtersForm">
      <h3>Filter By</h3>
      {genres?.map((genre) => {
        return (
        <div key={genre.id}>
          <label htmlFor={`genreBox${genre.id}`}>
            <input type="checkbox" name={genre.name} id={`genreBox${genre.id}`} checked={filteredGenres.includes(genre.id)} onChange={handleToggle}/>
            {genre.name}
          </label>
        </div>
        )
      })}
    </form>
  )
}
export default Filters