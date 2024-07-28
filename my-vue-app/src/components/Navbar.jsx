import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const {user, logoutUser} = useAppContext();

  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <SearchBar/>
      <div>
        <NavLink to="/games" end>All Games</NavLink>
        {!user ? 
          <NavLink to="/register">Sign Up</NavLink>
        :
          <button onClick={logoutUser}>Sign Out</button>
        }
      </div>
    </nav>
  )
}
export default Navbar