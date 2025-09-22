import express from "express";
import { addVehicle } from "../Controller/VehicleController.js";
import { mapVFilesToReq, uploadMiddlewareForDocs } from "../Middleware/UploadVehicleDocs.js";

const router = express.Router();
// document names will be tax, insurance, pollution
router.post("/registerVehicle", uploadMiddlewareForDocs, mapVFilesToReq, addVehicle)

export default router;