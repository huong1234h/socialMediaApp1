import express from "express";
import {
  addComment,
  addReplyComment,
  deleteComment,
  getComments,
  getReplyComments,
  updateComment,
} from "../controllers/comment.js";

const router = express.Router();

router.get("/reply",getReplyComments);
router.get("/", getComments);
router.put("/",updateComment);
router.post("/reply",addReplyComment);
router.post("/", addComment);
router.delete("/:id", deleteComment);

export default router;
