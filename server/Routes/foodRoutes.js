import express from "express";
import {
	createfoodController,
	deleteFoodController,
	deleteSaveRecipeController,
	foodPhotoController,
	getAllFoodController,
	getAllSavedRecipesController,
	getRecentRecipesController,
	getSingleFoodController,
	realtedFoodController,
	saveRecipeController,
	searchRecipesController,
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

//get recent recipes
router.get("/get-recent", getRecentRecipesController);

//similar product
router.get("/related-food/:fid/:cid", realtedFoodController);

//get food photo
router.get("/food-photo/:fid", foodPhotoController);

//delete food
router.delete("/delete-food/:fid", deleteFoodController);

//update food
router.put("/update-food/:fid", formidable(), updatefoodController);

//search recipes
router.get("/search/:keyword", searchRecipesController);

//save recipes
router.post("/save-recipe", formidable(), saveRecipeController);

//save recipes
router.delete("/delete-recipe/:fid", deleteSaveRecipeController);

//get all  saved recipes
router.get("/get-savedRecipes", getAllSavedRecipesController);

export default router;
