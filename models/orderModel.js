import mongoose from "mongoose";

const { Schema } = mongoose;
const singleProduct = Schema({
  name: {
    type: String,
    required: [true, "Nama harus di isi"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity harus di isi"],
  },
  price: {
    type: Number,
    required: [true, "Harga Tidak boleh kosong"],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});
const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total Harha harus di isi"],
  },
  itemDetail: [singleProduct],
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  firstName: {
    type: String,
    required: [true, "Nama depan harus di isi"],
  },
  lastName: {
    type: String,
    required: [true, "Nama belakang harus di isi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor telephone harus di isi"],
  },
  email: {
    type: String,
    required: [true, "Email harus di isi"],
  },
});
const Order = mongoose.model("Order", orderSchema);
export default Order;
