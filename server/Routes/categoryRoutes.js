import express from "express";
import {
	categoryController,
	createCategoryController,
} from "../controllers/categoryControllers.js";

const router = express.Router();

//routes
// create category
router.post("/create-category", createCategoryController);

//getALl category
router.get("/get-category", categoryController);

//single category
// router.get("/single-category/:slug", singleCategoryController);

//delete category
// router.delete(
// 	"/delete-category/:id",
// 	deleteCategoryCOntroller
// );

export default router;
