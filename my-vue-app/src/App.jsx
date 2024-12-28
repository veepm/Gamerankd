import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet,
} from "react-router-dom";
import SharedLayout from "./pages/SharedLayout";
import "./axios";
import { lazy, Suspense } from "react";

const Games = lazy(() => import("./pages/Games"));
const Error = lazy(() => import("./pages/Error"));
const Landing = lazy(() => import("./pages/Landing"));
const SingleGame = lazy(() => import("./pages/SingleGame"));
const Register = lazy(() => import("./pages/Register"));
const SingleUser = lazy(() => import("./pages/SingleUser"));
const Users = lazy(() => import("./pages/Users"));
const UserReviews = lazy(() => import("./pages/UserReviews"));

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
          {
            index: true,
            element: (
              <Suspense fallback="Loading...">
                <Landing />
              </Suspense>
            ),
          },
          {
            path: "games",
            element: (
              <Suspense fallback="Loading...">
                <Games />
              </Suspense>
            ),
          },
          {
            path: "games/:gameId",
            element: (
              <Suspense fallback="Loading...">
                <SingleGame />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback="Loading...">
                <Users />
              </Suspense>
            ),
          },
          {
            path: "users/:username",
            element: (
              <Suspense fallback="Loading...">
                <SingleUser />
              </Suspense>
            ),
          },
          {
            path: "/users/:username/lists/:listName",
            element: (
              <Suspense fallback="Loading...">
                <Games />
              </Suspense>
            ),
          },
          {
            path: "/users/:username/reviews",
            element: (
              <Suspense fallback="Loading...">
                <UserReviews />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: (
      <Suspense fallback="Loading...">
        <Register key={1} />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback="Loading...">
        <Register login key={2} />,
      </Suspense>
    ),
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
