import express from "express";
import { Register, Login, Logout } from "../controllers/loginUserController.js";
import { refreshToken } from "../controllers/refreshToken.js";

const router = express.Router();

router.post("/register", Register);
router.post("/Login", Login);
router.get("/token", refreshToken);
router.delete("/Logout", Logout);

export default router;
