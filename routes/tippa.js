import express from "express";
const router = express.Router()
import { requireAuth } from "../middleware/authMiddleware";
import {storeTips, getTips, getAllTips, getPoints, getPointDetails} from "../controllers/tippa.js"
router.post("/", requireAuth, storeTips)
router.get("/", requireAuth, getTips)
router.get("/allatips", getAllTips)
router.get("/points", getPoints)
router.get("/details", getPointDetails)
export default router;