import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { memo } from "react";
import {
  TbBaselineDensityMedium,
  TbHexagonLetterGFilled,
} from "react-icons/tb";
import ProfilePic from "./ProfilePic";
import Select from "./Select";

const Navbar = () => {
  const { user, logoutUser } = useAppContext();
  const navigate = useNavigate();

  const userOptions = [
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

  const dropOptions = [
    {
      options: [
        {
          label: "Games",
          value: () => navigate(`/games`),
        },
      ],
    },
    {
      options: [
        {
          label: "Users",
          value: () => navigate(`/users`),
        },
      ],
    },
  ].concat(userOptions);

  const handleChange = (option) => {
    option.value();
  };

  return (
    <nav className="navbar">
      <div>
        <NavLink to="/" title="Home">
          <TbHexagonLetterGFilled className="icon" />
        </NavLink>
        <div className="options">
          <NavLink to="/games" end>
            Games
          </NavLink>
          <NavLink to="/users" end>
            Users
          </NavLink>
          {!user ? (
            <NavLink to="/register">Login/Sign Up</NavLink>
          ) : (
            <Select
              options={userOptions}
              onChange={handleChange}
              className={"select"}
              displayIcon={false}
            >
              <ProfilePic username={user.username} className={"profilePic"} />
            </Select>
          )}
        </div>
        <div className="dropOptions">
          <Select
            options={dropOptions}
            onChange={handleChange}
            className={"select"}
            displayIcon={false}
          >
            <TbBaselineDensityMedium size="1.5rem" className="dropBars"/>
          </Select>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
