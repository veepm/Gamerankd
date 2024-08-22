import { useSearchParams } from "react-router-dom";
import Select from "./Select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const any = {options:[{label:"Any Genre",value:"any"}]};

const GenresFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let searchParam = searchParams.get("genres")?.split(",").flatMap(genre => {
    return Number(genre) || [];
  });

  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const {data} = await axios.get("/genres?sort=asc");
      return data;
    },
    gcTime: Infinity,
    staleTime: Infinity
  });

  const handleToggle = (options) => {
    if (options.length > 0 && !options.includes(any.options[0])){
      options.sort((a,b) => a.value - b.value);
      searchParams.set("genres", options.map(o => o.value));
    }
    else {
      searchParams.delete("genres");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  }

  if (genresQuery.isLoading) return

  const genres = genresQuery.data.genres.map(genre => ({options:[{label:genre.name,value:genre.id}]}));

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