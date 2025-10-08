import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { createSos, deleteSos, getAllSos, replySos, UpdateSosStatus } from "../Controller/SosController.js";
import { logger } from "../Middleware/logger.js";

const router = express.Router();

router.post("/createSos", verifyToken, logger, createSos);
router.put("/updateSos/:id", verifyToken, UpdateSosStatus);
router.delete("/deleteSos/:id", verifyToken, logger, deleteSos);
router.put("/replySos/:id", verifyToken, logger, replySos);

router.get("/getAllSos", verifyToken, getAllSos);

export default router;