import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { memo } from "react";
import {
  TbBaselineDensityMedium,
  TbHexagonLetterGFilled,
} from "react-icons/tb";
import ProfilePic from "./ProfilePic";
import Select from "./Select";
import classes from "./css/navbar.module.css";

const Navbar = () => {
  const { user, logoutUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  let userOptions = [];
  if (user) {
    userOptions = [
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
  } else {
    userOptions = [
      {
        options: [
          {
            label: "Login",
            value: () => navigate("/login", { state: { from: location } }),
          },
        ],
      },
      {
        options: [
          {
            label: "Register",
            value: () => navigate("/register", { state: { from: location } }),
          },
        ],
      },
    ];
  }

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
    <nav className={classes.navbar}>
      <div>
        <NavLink
          to="/"
          title="Home"
          style={{ display: "flex", alignItems: "center" }}
          className={({ isActive }) => (isActive ? classes.active : "")}
        >
          <TbHexagonLetterGFilled className={classes.icon} />{" "}
          <h3 className={classes.title}>ameRankD</h3>
        </NavLink>
        <div className={classes.options}>
          <NavLink
            to="/games"
            className={({ isActive }) => (isActive ? classes.active : "")}
            end
          >
            Games
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? classes.active : "")}
            end
          >
            Users
          </NavLink>
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? classes.active : "")}
                state={{ from: location }}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? classes.active : "")}
                state={{ from: location }}
              >
                Register
              </NavLink>
            </>
          ) : (
            <Select
              options={userOptions}
              onChange={handleChange}
              className={classes.select}
              displayIcon={false}
            >
              <ProfilePic
                username={user.username}
                className={classes.profilePic}
              />
            </Select>
          )}
        </div>
        <div className={classes.dropOptions}>
          <Select
            options={dropOptions}
            onChange={handleChange}
            className={classes.select}
            displayIcon={false}
          >
            <TbBaselineDensityMedium
              size="1.5rem"
              className={classes.dropBars}
            />
          </Select>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
