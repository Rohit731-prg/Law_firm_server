import journeyModel from "../Model/journeyModel.js";
import Vehicle from "../Model/VehicleModel.js";

export const startJourney = async (req, res) => {
    const { vehicleID, start, is_delete } = req.body;
    const id = req.user.id;
    if (!vehicleID || !start || is_delete === undefined ) return res.status(400).json({ message: "All fields are required" });

    try {
        if (!start?.latitude || !start?.longitude) return res.status(400).json({ message: "Location is required" });
        const vehicle = await Vehicle.findById(vehicleID);
        if (!vehicle) return res.status(400).json({ message: "Vehicle not found" });
        const newStart = {
            latitude: start.latitude,
            longitude: start.longitude,
            timeStamp: new Date()
        };
        const newJurney = new journeyModel({ userID: id, vehicleID, start: newStart, is_delete });
        await newJurney.save();
        res.status(201).json({ message: "Journey started successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const endJourney = async (req, res) => {
    const { id, end } = req.body;
    if (!id || !end) return res.status(400).json({ message: "All fields are required" });
    try {
        if (!end?.latitude || !end?.longitude) return res.status(400).json({ message: "Location is required" });
        const journey = await journeyModel.findById(id);
        if (!journey) return res.status(400).json({ message: "Journey not found" });
        const newEnd = {
            latitude: end.latitude,
            longitude: end.longitude,
            timeStamp: new Date()
        }
        journey.end = newEnd;
        await journey.save();
        res.status(200).json({ message: "Journey ended successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const pushLocation = async (req, res) => {
    const { id, location } = req.body;
    if (!id || !location) return res.status(400).json({ message: "All fields are required" });
    if (!location?.latitude || !location?.longitude) return res.status(400).json({ message: "Location is required" });
    try {
        const journey = await journeyModel.findById(id);
        if (!journey) return res.status(400).json({ message: "Journey not found" });

        const newJourney = {
            latitude: location.latitude,
            longitude: location.longitude,
            timeStamp: new Date()
        }
        journey.journeyList.push(newJourney);
        await journey.save();
        res.status(200).json({ message: "Location pushed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const getJourneys = async (req, res) => {
    const { id } = req.user;
    try {
        const journeys = await journeyModel.find({ userID: id });
        if (journeys.length === 0) return res.status(400).json({ message: "No journeys found" });
        res.status(200).json({ message: "Journeys fetched successfully", journeys });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getJourney = async (req, res) => {
    const { id } = req.params;
    try {
        const journey = await journeyModel.findById(id);
        if (!journey) return res.status(400).json({ message: "Journey not found" });
        res.status(200).json({ message: "Journey fetched successfully", journey });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}