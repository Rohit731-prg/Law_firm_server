import express from "express";
import { upload, uploadImage } from "../Middleware/Multer.js";
import {
    getAllLeads, getAllUsers, getUserByExpairDate, getUserDetailsByID, login, loginWithToken, logout, registerUser, sendOTP, updateDocs, verifyDocs, verifyOTP
} from "../Controller/UserController.js";
import { mapFilesToReq, uploadMiddleware } from "../Middleware/UploadUserDocs.js";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { makeUserAuth } from "../Controller/AdminController.js";
import { mapFileToReq, uploadSingleMiddleware } from "../Middleware/UploadSingleDocs.js";

const router = express.Router();

router.post("/registerUser", upload.single("image"), uploadImage, registerUser);
// document names will be pan, aadhar, driving_licence
router.put("/verifyDocs/:id", uploadMiddleware, mapFilesToReq, verifyDocs);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", verifyToken, loginWithToken);

router.get('/sendOTP', verifyToken, sendOTP);
router.put('/verifyOTP', verifyToken, verifyOTP);

router.get("/getAllLeads", verifyToken, getAllLeads);
router.get("/getAllUsers", verifyToken, getAllUsers);
router.get("/getUserDetailsByID/:id", verifyToken, getUserDetailsByID);
router.get("/makeUserAuth/:id", verifyToken, makeUserAuth);

router.put("/updateDocs/:id", verifyToken, uploadSingleMiddleware, mapFileToReq, updateDocs); // working but not perfectly
router.get("/getUserByExpairDate/:name", verifyToken, getUserByExpairDate); // working but not properly tested

export default router;