import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama product harus di isi"],
    unique: [true, "Nama product sudah di gunakan coba dengan nama lain"],
  },
  price: {
    type: Number,
    required: [true, "Harga product harus di isi"],
  },
  description: {
    type: String,
    required: [true, "Description produck harus di isi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, " Category product harus di isi"],
    enum: ["sepatu", "kemeja", "baju", "celana"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
