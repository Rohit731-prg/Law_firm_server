import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { 
    createInfo,
    deleteInfo,
    filterByType,
    filterByvalue,
    updateInfo
} from "../Controller/InfoController.js";

const router = express.Router();

router.post("/createInfo", verifyToken, createInfo);
router.delete("/deleteInfo/:id", verifyToken, deleteInfo);
router.post("/filterByType", verifyToken, filterByType);
router.post("/filterByValue", verifyToken, filterByvalue);
router.put("/updateInfo/:id", verifyToken, updateInfo);

export default router;