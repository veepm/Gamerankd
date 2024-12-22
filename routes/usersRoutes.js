import express from "express";
import { getUserReviews } from "../controllers/reviews.js";
import { getUserLists } from "../controllers/gamesLists.js";
import { getUserGameInfo, getUsers } from "../controllers/user.js";
import { getUserList } from "../controllers/gamesLists.js";

const router = express.Router();

router.route("/").get(getUsers);

router.route("/:username/reviews").get(getUserReviews);

router.route("/:username/lists").get(getUserLists);

router.route("/:username/lists/:listName").get(getUserList);

router.route("/:username/games/:gameId").get(getUserGameInfo);

export default router;
