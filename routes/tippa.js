import express from "express";
const router = express.Router()
import {storeTips} from "../controllers/tippa.js"
router.post("/", storeTips)
export default router;