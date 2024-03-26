import express from "express";
import { getAllMessages, sendMessage } from "../controllers/message.js";


const router = express.Router();

router.get("/:zoomId",getAllMessages);
router.post("/",sendMessage);



export default router ;
