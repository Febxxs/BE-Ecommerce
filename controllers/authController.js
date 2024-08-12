import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";

// Fungsi untuk menandatangani token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

// Fungsi untuk membuat dan mengirimkan token serta response
const creatSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Menentukan opsi cookie
  const cookieOptions = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: process.env.NODE_ENV === "development" ? false : true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    data: user,
  });
};

// Fungsi untuk registrasi user
export const registerUser = asyncHandler(async (req, res) => {
  // Menentukan role user

  const isOwner = (await User.countDocuments()) === 0;
  const role = isOwner ? "owner" : "user";

  // Membuat user baru
  const createdUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });

  // Mengirim response dengan token
  creatSendResToken(createdUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // validasi
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Email dan password tidak boleh kosong");
  }
  // check email sudah ada atu belum
  const userData = await User.findOne({
    email: req.body.email,
  });
  // check password sudah ada atu belum

  if (userData && (await userData.comparePassword(req.body.password))) {
    creatSendResToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Logout Berhasil",
  });
};
