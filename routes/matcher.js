import express from "express";
const router = express.Router()
import {getMatcher, setResults} from "../controllers/matcher.js"
router.get("/", getMatcher)
router.post("/", setResults)
export default router;