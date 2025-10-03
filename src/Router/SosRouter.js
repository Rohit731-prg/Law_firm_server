import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { createSos, deleteSos, getAllSos, UpdateSosStatus } from "../Controller/SosController.js";

const router = express.Router();

router.post("/createSos", verifyToken, createSos);
router.put("/updateSos/:id", verifyToken, UpdateSosStatus);
router.delete("/deleteSos/:id", verifyToken, deleteSos);

router.get("/getAllSos", verifyToken, getAllSos);

export default router;