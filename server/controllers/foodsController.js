import foodModel from "../Models/Foods.js";
import Recipe from "../Models/savedRecipesModel.js";
import fs from "fs";
import slugify from "slugify";
export const createfoodController = async (req, res) => {
	try {
		const { name, description, ingredients, steps, userId, category } =
			req.fields;
		const { photo } = req.files;

		//validation
		switch (true) {
			case !name:
				return res.status(500).send({ error: "Name is Required" });
			case !description:
				return res.status(500).send({ error: "Description is Required" });
			case !ingredients:
				return res.status(500).send({ error: "Ingredients is Required" });
			case !category:
				return res.status(500).send({ error: "Category is Required" });
			case !steps:
				return res.status(500).send({ error: "Steps is Required" });
			case !userId:
				return res.status(500).send({ error: "UserId is Required" });
			case photo && photo.size > 1000000:
				return res
					.status(500)
					.send({ error: "photo is Required and should be less then 1mb" });
		}

		//save
		const foods = new foodModel({ ...req.fields, slug: slugify(name) });
		if (photo) {
			foods.photo.data = fs.readFileSync(photo.path);
			foods.photo.contentType = photo.type;
		}
		await foods.save();
		res.status(201).send({
			success: true,
			message: "Recipe Added Successfully!",
			foods,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Adding Recipe",
		});
	}
};

//get all food controller
export const getAllFoodController = async (req, res) => {
	try {
		const foods = await foodModel
			.find({})
			.populate("userId")
			.select("-photo")
			.sort({ createdAt: -1 });
		res.status(200).send({
			success: true,
			counTotal: foods.length,
			message: "Allfoods ",
			foods,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Erorr in getting food",
			error: error.message,
		});
	}
};

//get single food controller
export const getSingleFoodController = async (req, res) => {
	try {
		const food = await foodModel
			.findOne({ slug: req.params.slug })
			.select("-photo")
			.populate("category")
			.populate("userId");
		res.status(200).send({
			success: true,
			message: "Single Food Fetched",
			food,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Erorr in getting dingle food",
			error: error.message,
		});
	}
};

//get food photo controller
export const foodPhotoController = async (req, res) => {
	try {
		const food = await foodModel.findById(req.params.fid).select("photo");
		if (food.photo.data) {
			res.set("Content-type", food.photo.contentType);
			return res.status(200).send(food.photo.data);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Erorr in getting food photo",
			error: error.message,
		});
	}
};

//delete food controller
export const deleteFoodController = async (req, res) => {
	try {
		await foodModel.findByIdAndDelete(req.params.fid).select("-photo");
		res.status(200).send({
			success: true,
			message: "Food Deleted Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Erorr in deleting food",
			error: error.message,
		});
	}
};

//update food controller
export const updatefoodController = async (req, res) => {
	try {
		const { name, description, ingredients, steps, userId, category } =
			req.fields;
		const { photo } = req.files;

		//validation
		switch (true) {
			case !name:
				return res.status(500).send({ error: "Name is Required" });
			case !description:
				return res.status(500).send({ error: "Description is Required" });
			case !ingredients:
				return res.status(500).send({ error: "Ingredients is Required" });
			case !category:
				return res.status(500).send({ error: "Category is Required" });
			case !steps:
				return res.status(500).send({ error: "Steps is Required" });
			case !userId:
				return res.status(500).send({ error: "UserId is Required" });
			case photo && photo.size > 1000000:
				return res
					.status(500)
					.send({ error: "photo is Required and should be less then 1mb" });
		}

		//save
		const foods = await foodModel.findByIdAndUpdate(
			req.params.fid,
			{
				...req.fields,
				slug: slugify(name),
			},
			{ new: true }
		);
		if (photo) {
			foods.photo.data = fs.readFileSync(photo.path);
			foods.photo.contentType = photo.type;
		}
		await foods.save();
		res.status(201).send({
			success: true,
			message: "Recipe Updated Successfully!",
			foods,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error In Updating Recipe",
		});
	}
};

// search recipes
export const searchRecipesController = async (req, res) => {
	try {
		const { keyword } = req.params;
		const results = await foodModel
			.find({
				$or: [{ name: { $regex: keyword, $options: "i" } }],
				$or: [{ description: { $regex: keyword, $options: "i" } }],
				$or: [{ ingredients: { $regex: keyword, $options: "i" } }],
			})
			.select("-photo");
		res.json(results);
	} catch (error) {
		console.log(error);
		res.status(400).send({
			success: false,
			message: "Error In Search Recipe API",
			error,
		});
	}
};

// similar recipe
export const realtedFoodController = async (req, res) => {
	try {
		const { fid, cid } = req.params;
		const recipe = await foodModel
			.find({
				category: cid,
				_id: { $ne: fid },
			})
			.populate("category")
			.select("-photo")
			.limit(4);

		res.status(200).send({
			success: true,
			recipe,
		});
	} catch (error) {
		console.log(error);
		res.status(400).send({
			success: false,
			message: "error while geting related recipe",
			error,
		});
	}
};

//save saved recipes
export const saveRecipeController = async (req, res) => {
	try {
		const { _id, name, description, ingredients, steps, userId, category } =
			req.fields;
		const { photo } = req.files;

		//validation
		switch (true) {
			case !_id:
				return res.status(500).send({ error: "Id is Required" });
			case !name:
				return res.status(500).send({ error: "Name is Required" });
			case !description:
				return res.status(500).send({ error: "Description is Required" });
			case !ingredients:
				return res.status(500).send({ error: "Ingredients is Required" });
			case !category:
				return res.status(500).send({ error: "Category is Required" });
			case !steps:
				return res.status(500).send({ error: "Steps is Required" });
			case !userId:
				return res.status(500).send({ error: "UserId is Required" });
			case photo && photo.size > 1000000:
				return res
					.status(500)
					.send({ error: "photo is Required and should be less then 1mb" });
		}

		//check exisiting saved Recipe
		const existingSavedRecipe = await Recipe.findOne({ _id });

		//existingSavedRecipe user
		if (existingSavedRecipe) {
			return res.status(200).send({
				success: false,
				message: "Already Saved!",
			});
		}

		//save
		const foods = new Recipe({ ...req.fields, slug: slugify(name) });
		if (photo) {
			foods.photo.data = fs.readFileSync(photo.path);
			foods.photo.contentType = photo.type;
		}
		await foods.save();
		res.status(201).send({
			success: true,
			message: "Recipe saved Successfully!",
			foods,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in saving recipe",
		});
	}
};

//delete recipe controller
export const deleteSaveRecipeController = async (req, res) => {
	try {
		await Recipe.findByIdAndDelete(req.params.fid).select("-photo");
		res.status(200).send({
			success: true,
			message: "Recipe Unsaved",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Erorr in unsaving recipe",
			error: error.message,
		});
	}
};

//get all food controller
export const getAllSavedRecipesController = async (req, res) => {
	try {
		const Recipes = await Recipe.find({})
			.populate("userId")
			.select("-photo")
			.sort({ createdAt: -1 });
		res.status(200).send({
			success: true,
			counTotal: Recipes.length,
			message: "AllSavedRecipes ",
			Recipes,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Erorr in getting saved recipes",
			error: error.message,
		});
	}
};
