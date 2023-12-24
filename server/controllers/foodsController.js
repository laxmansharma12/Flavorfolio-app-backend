import foodModel from "../Models/Foods.js";
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
			message: "food added Successfully!",
			foods,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in adding food",
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
			.limit(10)
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
			.populate("user");
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
		const { name, slug, description, ingredients, steps, user } = req.fields;
		const { photo } = req.files;

		//validation
		if (!name) {
			return res.send({ message: "Name is required" });
		}
		if (!description) {
			return res.send({ message: "Description is required" });
		}
		if (!ingredients) {
			return res.send({ message: "Ingridients are required" });
		}
		if (!photo || photo.size > 1000000) {
			return res.send({
				message: "Photo is required and should be less than 1mb",
			});
		}
		if (!steps) {
			return res.send({ message: "steps are required" });
		}

		//save
		const foods = new foodModel.findByIdAndUpdate(
			req.params.fid,
			{
				...req.fields,
				slug: slugify(name),
			},
			{ new: true }
		);
		if (photo) {
			foods.photo.data = fs.readFilesSync(photo.path);
			foods.photo.contentType = photo.type;
		}
		await foods.save();
		res.status(201).send({
			success: true,
			message: "food updated Successfully!",
			foods,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in updating food",
		});
	}
};
