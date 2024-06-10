import express from "express";
import { addRelationship, deleteRelationship, getNumberFollowed, getNumberFollower, getRelationships } from "../controllers/relationship.js";

const router = express.Router()


router.get("/numberFw/:userId",getNumberFollower);
router.get("/numberFd/:userId",getNumberFollowed);
router.get("/", getRelationships)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)


export default router