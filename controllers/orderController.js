import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const CreatOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  // Periksa jika cartItem kosong
  if (!cartItem || cartItem.length === 0) {
    res.status(400);
    throw new Error("Keranjang masih kosong");
  }

  let orderItem = [];
  let total = 0;

  // Proses setiap item di cart
  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("Id product tidak ditemukan");
    }
    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };
    orderItem = [...orderItem, singleProduct];
    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemDetail: orderItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    user: req.user.id,
  });

  return res.status(201).json({
    total,

    order,
    message: "Berhasil Buat Order Product",
  });
});

export const AllOder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  return res.status(200).json({
    data: orders,
    message: "Berhasil Mengambil Semua Order Product",
  });
});

export const DetailOrder = asyncHandler(async (req, res) => {
  const detailOrder = await Order.findById(req.params.id);
  return res.status(200).json({
    data: detailOrder,
    message: "Berhasil Mengambil Detail Order Product",
  });
});

export const CurrentUserOrder = asyncHandler(async (req, res) => {
  const currentUserOrder = await Order.find({ user: req.user.id });
  return res.status(200).json({
    data: currentUserOrder,
    message: "Berhasil Mengambil User Current Order Product",
  });
});
