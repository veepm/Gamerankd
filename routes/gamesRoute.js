import express from "express";
import { getGames, getSingleGame } from "../controllers/games.js";
import authMiddleware from "../middleware/authentication.js";
import { addReview, deleteReview, getGameReviews, updateReview } from "../controllers/reviews.js";

const router = express.Router();

router.route("/").get(getGames);

router.route("/:gameId").get(getSingleGame);

router.route("/:gameId/reviews").get(getGameReviews).post(authMiddleware,addReview).patch(authMiddleware,updateReview).delete(authMiddleware,deleteReview);

export default router;