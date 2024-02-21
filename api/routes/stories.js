import express from "express";
import { addStory, deleteStory, getStories } from "../controllers/story.js";

const router = express.Router();

router.get("/", getStories);
router.post("/", addStory);
router.delete("/:id", deleteStory);

export default router;
