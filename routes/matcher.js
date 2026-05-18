import express from "express";
const router = express.Router()
import {getMatcher} from "../controllers/matcher.js"
router.get("/", getMatcher)
export default router;