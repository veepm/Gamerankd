import express from "express";
import { deleteReview, getAllReviews, updateReview } from "../controllers/reviews.js";
import authMiddleware from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(getAllReviews);

router.route("/games/:gameId").patch(authMiddleware,updateReview).delete(authMiddleware,deleteReview);

export default router;