import express from "express";
import { getUserReviews } from "../controllers/reviews.js";
import { getUserLists } from "../controllers/gamesLists.js";
import { getUserGameInfo } from "../controllers/user.js";

const router = express.Router();

router.route("/:username/reviews").get(getUserReviews);

router.route("/:username/lists").get(getUserLists);

router.route("/:username/games/:gameId").get(getUserGameInfo);

export default router;