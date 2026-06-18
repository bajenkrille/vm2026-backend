import express from "express";
const router = express.Router()
import {getMatcher, setResults, getDagensMatcher} from "../controllers/matcher.js"
router.get("/", getMatcher)
router.get("/today", getDagensMatcher)
router.post("/", setResults)
export default router;