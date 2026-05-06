import express from "express";
import { Signup, Login, Logout, getMe, checkAuth } from "../controller/auth.controller.js";
import {protectRoute} from "../utils/protectRoute.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/getMe",protectRoute, getMe );
router.get("/checkAuth",protectRoute, checkAuth );

export default router;