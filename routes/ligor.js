import express from "express";
import { requireAuth } from "../middleware/authMiddleware";
const router = express.Router()
import {skapaLiga, getLigor, getLigaDeltagare, getMinaLigor} from "../controllers/ligor.js"
router.post("/", requireAuth, skapaLiga)
router.get("/", getLigor)
router.get("/deltagare", getLigaDeltagare)
router.get("/minaLigor", requireAuth, getMinaLigor)
export default router;