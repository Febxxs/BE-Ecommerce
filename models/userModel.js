import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama harus di isi"],
    unique: [true, "Username sudah di gunakan coba nama lain"],
  },
  email: {
    type: String,
    required: [true, "Email harus di isi"],
    unique: [true, "Email sudah terdaftar"],
    validate: {
      validator: validator.isEmail,
      message: "Inputan harus berformat email",
    },
  },
  password: {
    type: String,
    required: [true, "Password harus di isi"],
    minLength: [6, "Password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
