import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
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
            value: () =>
              navigate("/login", { state: { from: location } }),
          },
        ],
      },
      {
        options: [
          {
            label: "Register",
            value: () =>
              navigate("/register", { state: { from: location } }),
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
    <nav className="navbar">
      <div>
        <NavLink
          to="/"
          title="Home"
          style={{ display: "flex", alignItems: "center" }}
        >
          <TbHexagonLetterGFilled className="icon" />{" "}
          <h3 className={"title"}>ameRankD</h3>
        </NavLink>
        <div className="options">
          <NavLink to="/games" end>
            Games
          </NavLink>
          <NavLink to="/users" end>
            Users
          </NavLink>
          {!user ? (
            <>
              <NavLink to="/login" state={{ from: location }}>
                Login
              </NavLink>
              <NavLink to="/register" state={{ from: location }}>
                Register
              </NavLink>
            </>
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
            <TbBaselineDensityMedium size="1.5rem" className="dropBars" />
          </Select>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
