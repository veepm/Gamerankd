import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <div>
        <input type="search" name="" id="" placeholder="Search" style={{border:"none"}}/>
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