import { CiSearch } from "react-icons/ci";
import { NavLink, useSearchParams, useLocation } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useEffect, useMemo, useRef, useState } from "react";

const Navbar = () => {
  const {handleChange, user, search} = useAppContext();
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  
  const searchParam = searchParams.get("search") || "";

  const isMounted = useRef(false);

  // set search param on search change
  useEffect(() => {

    if (!isMounted.current){
      isMounted.current = true;
      return;
    }

    setSearchParams((prev) => {
      //console.log(Object.fromEntries(prev.entries()));
      prev.set("search", search);
      return prev;
    }, {replace:true});

      setSearchValue(search);

      //handleChange("games",[]);
  },[search]);

  // set search value on mount
  useEffect(() => {
    setSearchValue(searchParam);
    handleChange("search", searchParam);
  },[location.pathname]);

  
  const debounce = () => {
    let timeoutID;
    return (e) => {
      setSearchValue(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
       handleChange("search",e.target.value);
      }, 750);
    };
  };

  // remembers debounce func so that it isn't re-created on every re-render
  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <div>
        <input type="search" name="" id="" placeholder="Search" style={{border:"none"}} onChange={optimizedDebounce} value={searchValue}/>
        <button style={{border:"none"}}><CiSearch/></button>
      </div>
      <div>
        <NavLink to="/games">All Games</NavLink>
        {!user && <NavLink to="/register">Sign Up</NavLink>}
      </div>
    </nav>
  )
}
export default Navbar