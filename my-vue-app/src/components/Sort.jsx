import { useSearchParams } from "react-router-dom"

const Sort = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "popularity";

  const handleChange = (e) => {
    searchParams.set("sortBy", e.target.value);
    searchParams.delete("page");
    setSearchParams(searchParams,{replace:true});
  }

  return (
    <select onChange={handleChange} value={sortBy}>
      <option value="popularity">Popularity</option>
      <optgroup label="Name">
        <option value="a-z">A-Z</option>
        <option value="z-a">Z-A</option>
      </optgroup>
      <optgroup label="Rating">
        <option value="highest">Highest Rated</option>
        <option value="lowest">Lowest Rated</option>
      </optgroup>
      <optgroup label="Year Made">
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </optgroup>
    </select>
  )
}
export default Sort