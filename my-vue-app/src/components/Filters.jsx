import { useEffect } from "react";
import { useAppContext } from "../context/appContext"
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

const Filters = () => {
  const {genres, getGenres, filteredGenres,handleChange, resetInput} = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getGenres();
  },[]);

  useEffect(()=>{
    return resetInput();
  },[location]);

  const handleToggle = (e) => {
    const checked = e.target.checked;
    const genreId = Number(e.target.id.split("genreBox")[1]);
    let newFiltered;
    if (checked){
      newFiltered = [...filteredGenres, genreId];
    }
    else {
      newFiltered = filteredGenres.filter((genre) => {
        return genre !== genreId;
        });
    }
    handleChange("filteredGenres", newFiltered)
  }

  return (
    <form action="" className="filtersForm">
      <h3>Filter By</h3>
      {genres.map((genre) => {
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