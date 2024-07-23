import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const {user} = useAppContext();

  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <SearchBar/>
      <div>
        <NavLink to="/games" end>All Games</NavLink>
        <NavLink to="/register">Sign Up</NavLink>
      </div>
    </nav>
  )
}
export default Navbar