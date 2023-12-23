import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../Models/User.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
	try {
		const { name, email, password, answer } = req.body;
		//validation
		if (!name) {
			return res.send({ message: "Name is required" });
		}
		if (!email) {
			return res.send({ message: "Email is required" });
		}
		if (!password) {
			return res.send({ message: "Password is required" });
		}
		if (!answer) {
			return res.send({ message: "Answer is required" });
		}

		//check user
		const existingUser = await userModel.findOne({ email });

		//existingUser user
		if (existingUser) {
			return res.status(200).send({
				success: false,
				message: "Already Registered Please Sign-up Again!",
			});
		}

		//register user
		const hashedPassword = await hashPassword(password);

		//save
		const user = await new userModel({
			name,
			email,
			answer,
			password: hashedPassword,
		}).save();
		res.status(201).send({
			success: true,
			message: "User Signed Successfully!",
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in sign-up",
		});
	}
};

//POST LOGIN
export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email) {
			return res.send({ message: "Email is required" });
		}
		if (!password) {
			return res.send({ message: "Password is required" });
		}
		//check user
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(200).send({
				success: false,
				message: "User is not registered!",
			});
		}
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.status(200).send({
				success: false,
				message: "Invalid Password",
			});
		}

		//token
		const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.status(200).send({
			success: true,
			message: "login successfully",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in login",
			error,
		});
	}
};

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
	try {
		const { email, answer, newPassword } = req.body;
		if (!email) {
			return res.send({ message: "Email is required" });
		}
		if (!answer) {
			return res.send({ message: "Answer is required" });
		}
		if (!newPassword) {
			return res.send({ message: "NewPassword is required" });
		}

		//check
		const user = await userModel.findOne({ email, answer });

		//validation
		if (!user) {
			return res.send({
				success: false,
				message: "Wrong Email or Answer",
			});
		}
		const hashed = await hashPassword(newPassword);
		await userModel.findByIdAndUpdate(user._id, { password: hashed });
		res.status(200).send({
			success: true,
			message: "Password Reset Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "something went wrong",
			error,
		});
	}
};
