import express from "express";
import {
  AllProduct,
  CreatProduct,
  DeleteProduct,
  DetailProduct,
  FileUpload,
  UpdateProduct,
} from "../controllers/productController.js";
import {
  adminMiddleware,
  protectedMiddleware,
} from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

router.post("/", protectedMiddleware, adminMiddleware, CreatProduct);

router.get("/", AllProduct);

router.get("/:id", DetailProduct);

router.put("/:id", protectedMiddleware, adminMiddleware, UpdateProduct);

router.delete("/:id", protectedMiddleware, adminMiddleware, DeleteProduct);

router.post(
  "/file-upload",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  FileUpload
);

export default router;
