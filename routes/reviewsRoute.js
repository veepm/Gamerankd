import express from "express";
import { getAllReviews } from "../controllers/reviews.js";

const router = express.Router();

router.route("/").get(getAllReviews);

export default router;
