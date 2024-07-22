import { useSearchParams} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";


const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setSearchValue(search);
  },[search]);

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setSearchValue(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        if (e.target.value){
          searchParams.set("search",e.target.value);
        }
        else {
          searchParams.delete("search");
        }
        searchParams.delete("page");
        setSearchParams(searchParams);
      }, 750);
    };
  };

  // remembers debounce func so that it isn't re-created on every re-render
  const optimizedDebounce = useMemo(() => debounce(), [searchParams]); // need to set search param as dependent so that initial params aren;t used

  return (
    <input type="search" name="" id="" placeholder="Search" onChange={optimizedDebounce} value={searchValue}/>
  )
}

export default SearchBar