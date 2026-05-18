import express from "express";
const router = express.Router()
import {getAllDeltagare} from "../controllers/deltagare"
router.get("/", getAllDeltagare)
export default router;