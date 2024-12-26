import express from "express";
import {
  login,
  logout,
  refresh,
  register,
  confirm,
} from "../controllers/auth.js";
import authMiddleware from "../middleware/authentication.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/refresh").post(refresh);
router.route("/confirmation/:token").get(confirm);

export default router;
