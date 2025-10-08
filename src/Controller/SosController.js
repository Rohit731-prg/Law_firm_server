import Sos from "../Model/SosModel.js";
import UserModel from "../Model/UserModel.js";

export const createSos = async (req, res) => {
    const { message, type } = req.body;
    if (!message || !type) return res.status(400).json({ message: "All fields are required" });
    try {
        const user = req.user;
        const newSos = new Sos({
            user: user,
            message,
            type: type,
            vehicle: user.vehicle
        });
        await newSos.save();
        res.status(201).json({
            message: "SOS created successfully"
        });
    } catch (error) {
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
        const user = await UserModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });
        const sos = await Sos.findOne({ user: user._id });
        if (!sos) return res.status(400).json({ message: "SOS not found" });
        await sos.remove();
        res.status(200).json({
            message: "SOS deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllSos = async (req, res) => {
    try {
        const soses = await Sos.find().populate("user").populate("vehicle").sort({ createdAt: -1 }).select("-password");
        if (soses.length === 0) return res.status(400).json({ message: "No SOS found" });
        res.status(200).json({ soses });
    } catch (error) {
        console.log(error)
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