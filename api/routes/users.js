import express from "express";
import { findUser, getFriends, getRecommendUser, getSearchedUsers, getUser, updateUser } from "../controllers/user.js";

const router = express.Router();
router.get("/friends",getFriends);
router.get("/find/:userId", getUser);
router.get("/search/:name",findUser);
router.get("/all/:name",getSearchedUsers);
router.get("/:id",getRecommendUser);
router.put("/", updateUser);



export default router;