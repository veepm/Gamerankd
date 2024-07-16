import express from "express";
import { getAllGames, getSingleGame } from "../controllers/games.js";

const router = express.Router();

router.route("/").get(getAllGames);

router.route("/:id").get(getSingleGame);

export default router;