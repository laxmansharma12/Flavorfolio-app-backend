import express from "express";
import {
	registerController,
	loginController,
	forgotPasswordController,
	SingleUserController,
} from "../controllers/authControllers.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//                 routing
//------------------------------------------------
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//FORGOT-PASSWORD || METHOD POST
router.post("/forgot-password", forgotPasswordController);

//SINGLE-USER || METHOD GET
router.get("/single-user/:uid", requireSignIn, SingleUserController);

export default router;
