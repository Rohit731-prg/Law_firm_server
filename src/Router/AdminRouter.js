import express from "express";
import { basicInfo, createAdmin, deleteAdmin, getAllAdmins, login, loginWithTokne, logout, rejectUser } from "../Controller/AdminController.js";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { upload, uploadImage } from "../Middleware/Multer.js";
import { deleteUser } from "../Controller/UserController.js";
import { logger } from "../Middleware/logger.js";

const router = express.Router();

router.get("/me", verifyToken, loginWithTokne);

router.post("/register", upload.single("image"), uploadImage, createAdmin);
router.post('/login', login);
router.get('/getAllAdmins', verifyToken, getAllAdmins);
router.delete("/deleteAdmin/:id", verifyToken, logger, deleteAdmin);
router.get("/getAllBasicInfo", verifyToken, basicInfo);
router.get("/logout", logger, logout);
// user routes
router.delete("/deleteUser/:id", verifyToken, logger, deleteUser);
router.put("/rejectUser/:id", verifyToken, logger, rejectUser);

export default router;