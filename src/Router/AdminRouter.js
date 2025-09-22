import express from "express";
import { createAdmin, getAllAdmins, login, loginWithTokne } from "../Controller/AdminController.js";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { upload, uploadImage } from "../Middleware/Multer.js";

const router = express.Router();

router.get("/me", verifyToken, loginWithTokne);

router.post("/register", upload.single("image"), uploadImage, createAdmin);
router.post('/login', login);
router.get('/getAllAdmins', verifyToken, getAllAdmins);

export default router;