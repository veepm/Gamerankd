import { NavLink, Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { TbSquareLetterGFilled,TbHexagonLetterGFilled } from "react-icons/tb";
import ProfilePic from "./ProfilePic";
import Select from "./Select";

const Navbar = () => {
  const { user, logoutUser } = useAppContext();

  return (
    <nav className="navbar">
      <div>
        <NavLink to="/" title="Home">
          <TbHexagonLetterGFilled className="icon" />
        </NavLink>
        <div>
          <NavLink to="/games" end>
            Games
          </NavLink>
          <NavLink to="/users" end>
            Users
          </NavLink>
          {!user ? (
            <NavLink to="/register">Sign Up</NavLink>
          ) : (
            <>
              <NavLink to={`/users/${user.username}/lists/wishlist`}>
                Wishlist
              </NavLink>
              <NavLink to={`/users/${user.username}/lists/played`}>
                Played
              </NavLink>
              <Link to="/" onClick={logoutUser}>
                Sign Out
              </Link>
              <Select options={[{options:[{label:"Any Genre",value:"any"}]}]} onChange={(o)=>console.log(o)} color={"inherit"} background={"none"} width="75px">
                <ProfilePic username={user.username} size="30px"/>
              </Select>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
