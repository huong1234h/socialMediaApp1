import express from 'express';
import { broadcastNotification, deleteNotification, getNotifications } from '../controllers/notification.js';

const router = express.Router() ;



router.get("/:userId",getNotifications);
router.delete("/:id",deleteNotification)
router.post("/add", broadcastNotification);
export default router;