import express from "express";
const router = express.Router()
import {getAllDeltagare, getDeltagareAndCompleteness} from "../controllers/deltagare"
router.get("/", getAllDeltagare)
router.get("/tippat", getDeltagareAndCompleteness)
export default router;