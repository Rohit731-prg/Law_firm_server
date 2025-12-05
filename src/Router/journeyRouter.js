import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import {
    endJourney,
    getJourney,
    getJourneys,
    pushLocation,
    singleTransfer,
    startJourney
} from "../Controller/JourneyController.js";
const router = express.Router();

router.post("/createJourney", verifyToken, startJourney);
router.put("/endJourney", endJourney);
router.put("/pushLocation", verifyToken, pushLocation);
router.get("/getJourneys/:id", verifyToken, getJourneys);
router.get("/getJourneyByID/:id", verifyToken, getJourney);

router.post("/singleTranfer/:id", verifyToken, singleTransfer);

export default router;