import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import foodsRoute from "./Routes/foodRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import cors from "cors";
//import path from "path";
// import { fileURLToPath } from "url";

//confugure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes;
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/food", foodsRoute);
app.use("/api/v1/category", categoryRoutes);

//rest api
app.get("/", (req, res) => {
	res.send("<h1>Welcome to Flavorfolio</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, (req, res) => {
	console.log(`Server running on ${PORT}`);
});
