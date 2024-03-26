import express from "express";
import { addConversations, getConversations } from "../controllers/conversation.js";


const router = express.Router() ;

router.post("/add",addConversations);
router.get("/:userId",getConversations);

export default router;