import express from "express";
const router = express.Router()
import {getAllDeltagare, getDeltagareAndCompleteness, setBetalning} from "../controllers/deltagare"
router.get("/", getAllDeltagare)
router.get("/tippat", getDeltagareAndCompleteness)
router.post("/betalning", setBetalning)
export default router;