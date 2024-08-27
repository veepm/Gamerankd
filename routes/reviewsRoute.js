import express from "express";
import { deleteReview, getAllReviews, updateReview } from "../controllers/reviews.js";

const router = express.Router();

router.route("/").get(getAllReviews);


export default router;