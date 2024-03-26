import express from "express";
import { findUser, getAllUser, getUser, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/search/:name",findUser);
router.get("/:id",getAllUser);
router.put("/", updateUser);


export default router;