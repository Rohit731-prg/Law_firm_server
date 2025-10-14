import Sos from "../Model/SosModel.js";

export const createSos = async (req, res) => {
    const { message, type, location } = req.body;
    if (!message || !type || !location) return res.status(400).json({ message: "All fields are required" });
    try {
        const user = req.user;
        const longitude = location?.longitude;
        const latitude = location?.latitude;
        const location_data = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`)
            .then(res => res.json());
        const newSos = new Sos({
            user: user,
            message,
            type: type,
            vehicle: user.vehicle,
            location,
            location_data
        });
        await newSos.save();
        res.status(201).json({
            message: "SOS created successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const UpdateSosStatus = async (req, res) => {
    const { id } = req.params;
    try {
        let sos = await Sos.findById(id);
        if (!sos) return res.status(400).json({ message: "SOS not found" });
        if (sos.status === "accepted") return res.status(400).json({ message: "SOS status already changed" });
        sos.status = "accepted";
        await sos.save();
        sos = await Sos.findById(id).populate("user").populate("vehicle");
        res.status(200).json({
            message: "SOS status changed successfully",
            sos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteSos = async (req, res) => {
    const { id } = req.params;
    try {
        const sos = await Sos.findById(id);
        if (!sos) return res.status(400).json({ message: "Sos not found" });
        await sos.deleteOne();
        res.status(200).json({
            message: "SOS deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllSos = async (req, res) => {
    try {
        const soses = await Sos.find().populate("vehicle").populate("user").sort({ createdAt: -1 });
        if (soses.length === 0) return res.status(400).json({ message: "No SOS found" });
        res.status(200).json({ soses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const replySos = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });
    try {
        let sos = await Sos.findById(id);
        if (!sos) return res.status(400).json({ message: "SOS not found" });

        sos.reply = message;
        await sos.save();
        sos = await Sos.findById(id).populate("user").populate("vehicle");
        res.status(200).json({ message: "Replied to SOS successfully", sos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}