import express from "express";
const router = express.Router()
import { requireAuth } from "../middleware/authMiddleware";
import {storeTips, getTips, getAllTips} from "../controllers/tippa.js"
router.post("/", requireAuth, storeTips)
router.get("/", requireAuth, getTips)
router.get("/allatips", requireAuth, getAllTips)
export default router;