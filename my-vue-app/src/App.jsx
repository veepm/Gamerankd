import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet,
} from "react-router-dom";
import {
  Games,
  Error,
  Landing,
  SharedLayout,
  SingleGame,
  Register,
  ProtectedRoute,
  SingleUser,
  Users,
  UserReviews,
} from "./pages/index";
import "./axios";

const AppLayout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <SharedLayout />,
        children: [
          { index: true, element: <Landing /> },
          { path: "games", element: <Games /> },
          { path: "games/:gameId", element: <SingleGame /> },
          { path: "users", element: <Users /> },
          { path: "users/:username", element: <SingleUser /> },
          { path: "/users/:username/lists/:listName", element: <Games /> },
          { path: "/users/:username/reviews", element: <UserReviews /> },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Register login/>
  },
  {
    path: "*",
    element: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
