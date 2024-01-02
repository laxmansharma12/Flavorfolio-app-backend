import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "foods",
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			require: true,
		},
		description: {
			type: String,
			required: true,
		},
		ingredients: {
			type: String,
			required: true,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		steps: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "category",
			required: true,
		},
	},
	{ timestamps: true }
);
export default mongoose.model("saved_recipe", recipeSchema);
