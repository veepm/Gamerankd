import express from "express";
import { getUserReviews } from "../controllers/reviews.js";
import { getUserLists } from "../controllers/gamesLists.js";

const router = express.Router();

router.route("/:username/reviews").get(getUserReviews);

router.route("/:username/lists").get(getUserLists);

export default router;