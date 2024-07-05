import express from "express";

const app = express();

app.route("/").get(getAllGames)