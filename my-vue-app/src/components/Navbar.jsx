import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const Navbar = () => {
  const {user, logoutUser} = useAppContext();

  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <div>
        <NavLink to="/games" end>All Games</NavLink>
        {!user ? 
          <NavLink to="/register">Sign Up</NavLink>
        :
          <>
            <NavLink to={`/users/${user.username}/lists/wishlist`}>Wishlist</NavLink>
            <NavLink to={`/users/${user.username}/lists/played`}>Played</NavLink>
            <NavLink to="/" onClick={logoutUser}>Sign Out</NavLink>
          </>
        }
      </div>
    </nav>
  )
}
export default Navbar