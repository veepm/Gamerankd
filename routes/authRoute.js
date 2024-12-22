import express from "express";
import { login, logout, refresh, register } from "../controllers/auth.js";
import authMiddleware from "../middleware/authentication.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/refresh").post(refresh);

export default router;
