// userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  sendForgotPasswordEmail,
} = require("../controller/auth");

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/users/:id", getUserById);
userRoutes.get("/users", getAllUsers);
userRoutes.put("/users/:id", updateUser);
userRoutes.delete("/users/:id", deleteUser);
userRoutes.post("/forgot", sendForgotPasswordEmail);

module.exports = userRoutes;
