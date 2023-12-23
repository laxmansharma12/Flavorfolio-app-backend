import express from "express";
import {
	createfoodController,
	deleteFoodController,
	foodPhotoController,
	getAllFoodController,
	getSingleFoodController,
	updatefoodController,
} from "../controllers/foodsController.js";
import formidable from "express-formidable";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//---------------routes-----------------------

//create food
router.post("/create-food", formidable(), createfoodController);

//get all food
router.get("/get-food", getAllFoodController);

//get single food
router.get("/get-food/:slug", getSingleFoodController);

//get food photo
router.get("/food-photo/:fid", foodPhotoController);

//delete food
router.delete("/delete-food/:fid", deleteFoodController);

//update food
router.post(
	"/update-food/:fid",
	requireSignIn,
	formidable(),
	updatefoodController
);

export default router;
