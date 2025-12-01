import express from "express";
import { verifyToken } from "../Middleware/JwtMiddleware.js";
import {
    endJourney,
    getJourney,
    getJourneys,
    pushLocation,
    startJourney
} from "../Controller/JourneyController.js";
const router = express.Router();

router.post("/createJourney", verifyToken, startJourney);
router.put("/endJourney", verifyToken, endJourney);
router.put("/pushLocation", verifyToken, pushLocation);
router.get("/getJourneys", verifyToken, getJourneys);
router.get("/getJourneyByID/:id", verifyToken, getJourney);

export default router;