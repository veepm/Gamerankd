import "dotenv/config";
import "express-async-errors";

import express from "express";
const app = express();

import errorHandlerMiddleware from "./middleware/error-handler.js";

import gamesRoute from "./routes/gamesRoute.js";

app.use(express.json());
app.use("/games", gamesRoute);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listenting on port ${port}`);
})