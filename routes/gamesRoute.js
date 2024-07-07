import express from "express";
import instance from "../axios.js"
import { getAllGames, getSingleGame} from "../controllers/games.js";

const router = express.Router();

router.route("/").get(getAllGames);

router.route("/:id").get(getSingleGame);

export default router;