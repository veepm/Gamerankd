import { useSearchParams } from "react-router-dom";
import useFetch from "../useFetch"
import Select from "./Select";

const any = {options:[{label:"Any Genre",value:"any"}]};

const GenresFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let searchParam = searchParams.get("genres")?.split(",").flatMap(genre => {
    return Number(genre) || [];
  });

  const {data,isLoading,error} = useFetch({method:"get",url:"/genres?sort=asc"});

  const handleToggle = (options) => {
    if (options.length > 0 && !options.includes(any.options[0])){
      searchParams.set("genres", options.map(o => o.value));
    }
    else {
      searchParams.delete("genres");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  }

  if (isLoading) return

  const genres = data.genres.map(genre => ({options:[{label:genre.name,value:genre.id}]}));

  const genresMap = genres.reduce((map,genre) => (map[genre.options[0].value] = genre.options[0].label, map),{});

  const filteredGenres = searchParam?.map((s) => ({label:genresMap[s],value:s})) || [];

  return (
    <Select 
      options={[any, ...genres]} 
      label={"Genres"} 
      value={filteredGenres} 
      onChange={handleToggle} 
      multiselect
    />
  )
};
export default GenresFilter;