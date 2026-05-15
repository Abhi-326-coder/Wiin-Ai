import express from "express";
import { Signup, Login, Logout, getMe, checkAuth } from "../controller/auth.controller.js";
import {protectRoute} from "../utils/protectRoute.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/getme",protectRoute, getMe );
router.get("/checkauth",protectRoute, checkAuth );

export default router;
