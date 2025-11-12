import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import { 
    createInfo,
    defaultDetails,
    defaultDetailsWithFilter,
    deleteInfo,
    filterByType,
    filterByvalue,
    getInfoByDistrict,
    getInfoByPolice_Station,
    getInfoByState,
    getInfoBySub_Division,
    updateInfo
} from "../Controller/InfoController.js";
import { logger } from "../Middleware/logger.js";

const router = express.Router();

router.post("/createInfo", verifyToken, logger, createInfo);
router.delete("/deleteInfo/:id", verifyToken, logger, deleteInfo);
router.post("/filterByType", verifyToken, filterByType);
router.post("/filterByValue", verifyToken, filterByvalue);
router.put("/updateInfo/:id", verifyToken, logger, updateInfo);

router.post("/getAllInfoByState", verifyToken, getInfoByState);
router.post("/getAllInfoBySub_division", verifyToken, getInfoBySub_Division);
router.post("/getAllInfoByDistrict", verifyToken, getInfoByDistrict);
router.post("/getAllInfoByPolice_station", verifyToken, getInfoByPolice_Station);

router.get("/getAllDefaultDetails", verifyToken, defaultDetails);
router.post("/getAllDefaultDetailsWithType", verifyToken, defaultDetailsWithFilter);

export default router;