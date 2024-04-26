import foodModel from "../Models/Foods.js";
import userModel from "../Models/User.js";
import slugify from "slugify";
import cloudinary from "../utils/cloudinary.js";
export const createfoodController = async (req, res) => {
	try {
		const { name, description, ingredients, steps, userId, category } =
			req.fields;
		const { photo } = req.files;
		// Get the path to the uploaded file
		const filePath = photo.path;
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
		}

		//save
		const img = await cloudinary.uploader.upload(filePath, {
			folder: "foodPhotos",
		});

		const foods = new foodModel({
			...req.fields,
			photo: { id: img.public_id, url: img.secure_url },
			slug: slugify(name),
		});

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
			.populate("category")
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

//delete food controller
export const deleteFoodController = async (req, res) => {
	try {
		const food = await foodModel.findByIdAndDelete(req.params.fid);
		if (food?.photo?.id) {
			await cloudinary.uploader.destroy(food?.photo?.id);
		}
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

		// Check if a photo is present in the request and set photo path
		const filePath = photo ? photo.path : "";

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
		}

		//find photo and delete it
		const data = await foodModel.findById(req.params.fid);
		if (filePath !== "") {
			const oldPhoto = data?.photo?.id;
			if (oldPhoto) {
				await cloudinary.uploader.destroy(oldPhoto);
			}
		}

		// Save
		let foods;
		if (filePath !== "") {
			const img = await cloudinary.uploader.upload(filePath, {
				folder: "foodPhotos",
			});

			foods = await foodModel
				.findByIdAndUpdate(
					req.params.fid,
					{
						...req.fields,
						photo: { id: img.public_id, url: img.secure_url },
						slug: slugify(name),
					},
					{ new: true }
				)
				.populate("category");
		} else {
			// If no new photo is uploaded, update other fields without modifying the photo field
			foods = await foodModel
				.findByIdAndUpdate(
					req.params.fid,
					{
						...req.fields,
						slug: slugify(name),
					},
					{ new: true }
				)
				.populate("category");
		}

		await foods.save();
		res.status(201).send({
			success: true,
			message: "Recipe Updated Successfully!",
			foods,
			data,
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
		const results = await foodModel.find({
			$or: [{ name: { $regex: keyword, $options: "i" } }],
			$or: [{ description: { $regex: keyword, $options: "i" } }],
			$or: [{ ingredients: { $regex: keyword, $options: "i" } }],
		});
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
		const { _id, userId } = req.fields;

		//check exisiting saved Recipe
		{
			try {
				const user = await userModel.findById(userId);
				const savedRecipes = user.savedRecipes.find(
					(id) => id.toString() === _id
				);

				if (savedRecipes) {
					let user = await userModel.findByIdAndUpdate(
						userId,
						{
							$pull: {
								savedRecipes: _id,
							},
						},
						{
							new: true,
						}
					);
					return res.status(200).send({
						success: true,
						message: "Recipe UnSaved!",
					});
				} else {
					let user = await userModel.findByIdAndUpdate(
						userId,
						{
							$push: {
								savedRecipes: _id,
							},
						},
						{
							new: true,
						}
					);
					return res.status(200).send({
						success: true,
						message: "Recipe Saved!",
					});
				}
			} catch (error) {
				console.log(error);
			}
		}

		//save

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

//get recent recipes controller
export const getRecentRecipesController = async (req, res) => {
	try {
		const foods = await foodModel
			.find({})
			.populate("userId")
			.sort({ createdAt: -1 })
			.limit(6);
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
