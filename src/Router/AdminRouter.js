import express from "express";
import { createAdmin, deleteAdmin, getAllAdmins, login, loginWithTokne, rejectUser } from "../Controller/AdminController.js";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { upload, uploadImage } from "../Middleware/Multer.js";
import { logger } from "../Middleware/Logger.js";
import { deleteUser } from "../Controller/UserController.js";

const router = express.Router();

router.get("/me", verifyToken, loginWithTokne);

router.post("/register", upload.single("image"), uploadImage, createAdmin);
router.post('/login', login);
router.get('/getAllAdmins', verifyToken, getAllAdmins);
router.delete("/deleteAdmin/:id", verifyToken, logger, deleteAdmin);

// user routes
router.delete("/deleteUser/:id", verifyToken, logger, deleteUser);
router.put("/rejectUser/:id", verifyToken, logger, rejectUser);

export default router;