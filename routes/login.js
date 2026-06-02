import express from "express";
const router = express.Router()
import {loginUser, registerUser, generateResetEmail, resetPsw } from "../controllers/login"
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/resetEmail", generateResetEmail)
router.post("/reset", resetPsw)
export default router;