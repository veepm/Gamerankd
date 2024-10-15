import "dotenv/config";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";

import express from "express";
const app = express();

import errorHandlerMiddleware from "./middleware/error-handler.js";

import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoutes.js";
import gamesRoute from "./routes/gamesRoute.js";
import genresRoute from "./routes/genresRoute.js";
import reviewsRoute from "./routes/reviewsRoute.js";
import gamesListsRoute from "./routes/gamesListsRoute.js";

app.use(cookieParser());
app.use(cors({origin: "https://gamerankd.onrender.com", credentials: true, exposedHeaders: ["set-cookie"]}));

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/games", gamesRoute);
app.use("/genres", genresRoute);
app.use("/reviews", reviewsRoute);
app.use("/lists", gamesListsRoute);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listenting on port ${port}`);
})