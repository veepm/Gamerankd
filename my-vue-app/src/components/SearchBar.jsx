import { useSearchParams, useLocation} from "react-router-dom";
import { useEffect, useState, memo } from "react";
import useDebounce from "../useDebounce";
import classes from "./css/searchBar.module.css";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({placeholder}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setSearchValue(search);
  },[search]);

  const debounce = useDebounce(
    (e) => {
      if (e.target.value){
        searchParams.set("search",e.target.value);
      }
      else {
        searchParams.delete("search");
      }
      searchParams.delete("page");
      setSearchParams(searchParams);
    },
    (e)=>setSearchValue(e.target.value),
    [location]
  )

  // const debounce = () => {
  //   let timeoutID;
  //   return (e) => {
  //     setSearchValue(e.target.value);
  //     clearTimeout(timeoutID);
  //     timeoutID = setTimeout(() => {
  //       if (e.target.value){
  //         searchParams.set("search",e.target.value);
  //       }
  //       else {
  //         searchParams.delete("search");
  //       }
  //       searchParams.delete("page");
  //       setSearchParams(searchParams);
  //     }, 750);
  //   };
  // };

  // // remembers debounce func so that it isn't re-created on every re-render
  // const optimizedDebounce = useMemo(() => debounce(), [searchParams]); // need to set search param as dependent so that initial params aren;t used

  return (
    <div className={classes.container}>
      <IoSearch className={classes.icon}/>
      <input 
        className={classes.searchBar}
        type="search" 
        name=""
        id="" 
        placeholder={placeholder} 
        onChange={debounce} 
        value={searchValue}
        />
    </div>
  )
};

export default memo(SearchBar);