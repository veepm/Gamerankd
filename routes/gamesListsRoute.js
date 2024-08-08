import express from "express";
import authMiddleware from "../middleware/authentication.js";
import { addListGame, createList, deleteList, deleteListGame, getList } from "../controllers/gamesLists.js";


const router = express.Router();

router.route("/").post(authMiddleware,createList);

router.route("/:listId").get(getList).delete(authMiddleware,deleteList);

router.route("/:listName/games").post(authMiddleware,addListGame);

router.route("/:listName/games/:gameId").delete(authMiddleware,deleteListGame);

export default router;