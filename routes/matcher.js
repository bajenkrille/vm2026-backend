import express from "express";
const router = express.Router()
import {getMatcher, setResults, getDagensMatcher, getLastUpdate} from "../controllers/matcher.js"
router.get("/", getMatcher)
router.get("/today", getDagensMatcher)
router.get("/update", getLastUpdate)
router.post("/", setResults)
export default router;