import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { memo } from "react";
import { TbSquareLetterGFilled, TbHexagonLetterGFilled } from "react-icons/tb";
import ProfilePic from "./ProfilePic";
import Select from "./Select";

const Navbar = () => {
  const { user, logoutUser } = useAppContext();
  const navigate = useNavigate();

  const options = [
    {
      options: [
        {
          label: "My Page",
          value: () => navigate(`/users/${user.username}`),
        },
      ],
    },
    {
      options: [
        {
          label: "Sign Out",
          value: () => {
            navigate("/");
            logoutUser();
          },
        },
      ],
    },
  ];

  const handleChange = (option) => {
    option.value();
  };

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
            <Select
              options={options}
              onChange={handleChange}
              color={"inherit"}
              background={"none"}
              width="70px"
            >
              <div>
                <ProfilePic username={user.username} size="30px" />
                {/* {user.username} */}
              </div>
            </Select>
          )}
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
