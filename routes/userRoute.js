import express from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, superOnly, getUsers);
router.get("/users/:id", verifyToken, superOnly, getUserById);
router.post("/users", verifyToken, superOnly, createUser);
router.patch("/users/:id", verifyToken, superOnly, updateUser);
router.delete("/users/:id", verifyToken, superOnly, deleteUser);

export default router;
