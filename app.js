import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js"; // Ensure file extension is included
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/produtcRouter.js";
import orderRouter from "./routes/orderRouter.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
const port = 3000;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// middleware
app.use(express.json()); // Parsing JSON body
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded body
app.use(cookieParser()); // Parsing cookies
app.use(express.static("./public"));

app.use("/api/v1/auth", authRouter); // Router
app.use("/api/v1/product", productRouter); // Router
app.use("/api/v1/order", orderRouter);

app.use(notFound); // Middleware untuk menangani route yang tidak ditemukan
app.use(errorHandler); // Middleware untuk menangani error

// server
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

//connection DB
mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("\x1b[42m Database Connected ... \x1b[0m");
});
