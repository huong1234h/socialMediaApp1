import express from "express";
import { addPost, deletePost, getPosts, numberPosts } from "../controllers/post.js";

const router = express.Router();
router.get("/:userId",numberPosts);
router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
