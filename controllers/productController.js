import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const CreatProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    message: "Berhasil Menambahkan Product",
    data: newProduct,
  });
});

export const AllProduct = asyncHandler(async (req, res) => {
  // request query
  const queryObj = { ...req.query };

  //fungsi untuk menamhkan jika ada req page dan limit
  const excludeField = ["page", "limi", "name"];
  excludeField.forEach((element) => delete queryObj[element]);

  let query;
  if (req.query.name) {
    query = Product.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  } else {
    query = Product.find(queryObj);
  }

  // pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments();
  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("Page tidak ditemukan");
    }
  }

  const data = await query;
  return res.status(200).json({
    message: "Berhasil menampilkan data",
    data,
    count: countProduct,
  });
});

export const DetailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;

  const productData = await Product.findById(paramsId);

  if (!productData) {
    throw new Error("Id dari product tidak ditemukan");
  }

  return res.status(200).json({
    message: `Detail Data Product`,
    data: productData,
  });
});

export const UpdateProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const updateProduct = await Product.findByIdAndUpdate(paramsId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Update Product Berhasil",
    data: updateProduct,
  });
});

export const DeleteProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;

  await Product.findOneAndDelete(paramsId);

  return res.status(200).json({
    message: "Delete Product Berhasil",
  });
});

export const FileUpload = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "jpeg"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Gagal upload image",
          error: err,
        });
      }
      res.json({ message: "Image berhasil di upload", url: result.secure_url });
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
