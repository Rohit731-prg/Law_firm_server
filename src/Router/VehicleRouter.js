import express from "express";
import { addVehicle, getDataById } from "../Controller/VehicleController.js";
import { mapVFilesToReq, uploadMiddlewareForDocs } from "../Middleware/UploadVehicleDocs.js";

const router = express.Router();
// document names will be tax, insurance, pollution
router.post("/registerVehicle", uploadMiddlewareForDocs, mapVFilesToReq, addVehicle);
router.get("/getVehicleByID/:id", getDataById);

export default router;