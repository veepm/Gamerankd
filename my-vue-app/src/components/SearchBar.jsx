import { useSearchParams} from "react-router-dom";
import { useEffect, useState, memo, useMemo } from "react";
import classes from "./css/searchBar.module.css";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({placeholder}) => {
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
        searchParams.delete("sortBy");
        searchParams.delete("genres");
        setSearchParams(searchParams);
      }, 750);
    };
  };

  // remembers debounce func so that it isn't re-created on every re-render
  const optimizedDebounce = useMemo(() => debounce(), [searchParams]); // need to set search param as dependent so that initial params aren't used

  return (
    <div className={classes.container}>
      <IoSearch className={classes.icon}/>
      <input 
        className={classes.searchBar}
        type="search" 
        name=""
        id="" 
        placeholder={placeholder} 
        onChange={optimizedDebounce} 
        value={searchValue}
        />
    </div>
  )
};

export default memo(SearchBar);