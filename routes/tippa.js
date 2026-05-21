import express from "express";
const router = express.Router()
import { requireAuth } from "../middleware/authMiddleware";
import {storeTips, getTips} from "../controllers/tippa.js"
router.post("/", requireAuth, storeTips)
router.get("/", requireAuth, getTips)
export default router;