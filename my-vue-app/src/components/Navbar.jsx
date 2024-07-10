import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useMemo, useState } from "react";

const Navbar = () => {
  const {handleSearch} = useAppContext();
  const [searchValue, setSearchValue] = useState("");

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setSearchValue(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleSearch(e.target.value);
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
        <NavLink to="/register">Sign Up</NavLink>
      </div>
    </nav>
  )
}
export default Navbar