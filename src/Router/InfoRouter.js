import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { 
    createInfo,
    deleteInfo,
    filterByType,
    filterByvalue,
    updateInfo
} from "../Controller/InfoController.js";
import { logger } from "../Middleware/logger.js";

const router = express.Router();

router.post("/createInfo", verifyToken, logger, createInfo);
router.delete("/deleteInfo/:id", verifyToken, logger, deleteInfo);
router.post("/filterByType", verifyToken, filterByType);
router.post("/filterByValue", verifyToken, filterByvalue);
router.put("/updateInfo/:id", verifyToken, logger, updateInfo);

export default router;