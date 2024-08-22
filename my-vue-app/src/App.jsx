import { createBrowserRouter,RouterProvider, ScrollRestoration, Outlet } from "react-router-dom";
import {Games, Error, Landing, SharedLayout, SingleGame, Register, ProtectedRoute} from "./pages/index";
import "./axios";
import Users from "./pages/Users";

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
        element: <SharedLayout/>,
        children: [
          {index: true, element: <Landing/>},
          {path: "games", element: <Games/>},
          {path: "games/:gameId", element: <SingleGame/>},
          {path: "users", element: <Users/>},
          {path: "/users/:username/lists/:listName", element: <Games/>}
        ]
      }
    ]
  },
  {
    path:"/register",
    element: <Register/>
  },
  {
    path: "*", 
    element: <Error/>
  }
]);

const App = () => {
  return <RouterProvider router={router}/>;
};

export default App;
