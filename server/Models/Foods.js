import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
	{
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
			id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
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

export default mongoose.model("foods", foodSchema);
