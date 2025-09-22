import path from "path";
import UserModel from "../Model/UserModel.js";
import bcrypt from "bcryptjs";
import Vehicle from "../Model/VehicleModel.js";
import { sendSMS } from "../Utils/Twilio.js";
import { generateToken } from "../Utils/JwtGenerator.js";
import fs from "fs";

export const registerUser = async (req, res) => {
    const { name, email, phone, password, address, pan_number, aadhar_number, driving_licence_number, referal_number, relation, vehicle } = req.body;
    if (!name || !email || !phone || !password || !address || !pan_number || !aadhar_number || !driving_licence_number || !referal_number || !relation || !vehicle) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const is_exist = await UserModel.findOne({ phone });
        if (is_exist) return res.status(400).json({ message: "User already exist" });

        const is_vehicle_exist = await Vehicle.findOne({ _id: vehicle });
        if (!is_vehicle_exist) return res.status(400).json({ message: "Vehicle not found" });

        // const hashedpassword = await bcrypt.hash(password, 12);
        const hashedpassword = password;

        const otp = Math.floor(Math.random() * 10000); // Generate a random 4-digit OTP

        const newUser = new UserModel({
            name, email, phone, password: hashedpassword, address,
            image: req.fileUrl,
            pan: { Number: pan_number },
            aadhar: { Number: aadhar_number },
            driving_licence: { Number: driving_licence_number },
            referal_number: { Number: referal_number, relation },
            otp
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const verifyDocs = async (req, res) => {
    const { id } = req.params;
    if (!req.file1 || !req.file2 || !req.file3) {
        return res.status(400).json({ message: "All 3 documents are required" });
    }

    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });

        const baseURL = `${req.protocol}://${req.get("host")}/uploads`;

        const file1Name = path.basename(req.file1);
        const file2Name = path.basename(req.file2);
        const file3Name = path.basename(req.file3);

        await UserModel.updateOne(
            { _id: id },
            {
                $set: {
                    pan: {
                        Number: user.pan.Number,
                        docs: `${baseURL}/${file1Name}`
                    },
                    aadhar: {   // ✅ fixed spelling
                        Number: user.aadhar.Number,
                        docs: `${baseURL}/${file2Name}`
                    },
                    driving_licence: {
                        Number: user.driving_licence.Number,
                        docs: `${baseURL}/${file3Name}`
                    }
                }
            }
        );

        res.status(200).json({ message: "Docs uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendOTP = async (req, res) => {
    try {
        const user = req.user;
        const otp = Math.floor(Math.random() * 10000); // Generate a random 4-digit OTP
        user.otp = otp;
        await user.save();
        const sms = `Your OTP is ${otp}`;
        await sendSMS(user.phone, sms);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "All fields are required" });
    try {
        const user = req.user;
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        user.otp = null;
        user.verify = true;
        await user.save();
        const sms = "OTP verified successfully";
        await sendSMS(phone, sms);
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await UserModel.findOne({ phone });
        if (!user) return res.status(400).json({ message: "User not found" });

        // const is_match = await bcrypt.compare(password, user.password);
        const is_match = password === user.password;
        if (!is_match) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id, user.phone, user.role);
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginWithToken = async (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user._id, user.phone, user.role);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllLeads = async (req, res) => {
    try {
        const leads = await UserModel.find({ auth: false }).select("-password").select("-otp");
        if (leads.length === 0) return res.status(400).json({ message: "No leads found" });

        res.status(200).json({ leads });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserDetailsByID = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await UserModel.findById(id).select("-password").select("-otp").populate("vehicle");
        if (!response) return res.status(400).json({ message: "User not found" });

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ auth: true }).select("-password").select("-otp").populate("vehicle");
        if (users.length === 0) return res.status(400).json({ message: "No users found" });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateDocs = async (req, res) => {
    const { id } = req.params;
    const { name, data } = req.body;
    if (!name || !data) return res.status(400).json({ message: "All fields are required" });
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });

        const vehicleModel = await Vehicle.findOne({ _id: user.vehicle });
        if (!vehicleModel) return res.status(400).json({ message: "Vehicle not found" });
        switch (name) {
            case "driving_licence": {
                const url = user.driving_licence.docs;
                const relativePath = path.join("src", "uploads", url.split("uploads/")[1]);
                const filePath = path.join(process.cwd(), relativePath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully");
                    }
                });
                const baseURL = `${req.protocol}://${req.get("host")}/uploads`;
                const file1Name = path.basename(req.fileUrl);
                await UserModel.updateOne({ _id: id }, { $set: { driving_licence: { Number: data, docs: `${baseURL}/${file1Name}` } } });
                res.status(200).json({ message: "Docs updated successfully" });
                break;
            } case "tax": {
                console.log(vehicleModel.tax)
                const url = vehicleModel.tax.docs;
                console.log("checking")
                const relativePath = path.join("src", "uploads", url.split("uploads/")[1]);
                const filePath = path.join(process.cwd(), relativePath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully");
                    }
                });
                const baseURL = `${req.protocol}://${req.get("host")}/uploads`;
                const file1Name = path.basename(req.fileUrl);
                const resp = await vehicleModel.updateOne({ _id: user.vehicle }, { $set: { tax: { 
                    expair_date: data,
                    docs: `${baseURL}/${file1Name}` 
                } } });
                console.log(resp)
                res.status(200).json({ message: "Docs updated successfully" });
                break;
            } case "insurance": {
                const url = user.insurance.docs;
                const relativePath = path.join("src", "uploads", url.split("uploads/")[1]);
                const filePath = path.join(process.cwd(), relativePath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully");
                    }
                });
                const baseURL = `${req.protocol}://${req.get("host")}/uploads`;
                const file1Name = path.basename(req.fileUrl);
                await vehicleModel.updateOne({ _id: user.vehicle }, { $set: { insurance: { expair_date: data, docs: `${baseURL}/${file1Name}` } } });
                res.status(200).json({ message: "Docs updated successfully" });
                break;
            } case "pollution": {
                const url = user.pollution.docs;
                const relativePath = path.join("src", "uploads", url.split("uploads/")[1]);
                const filePath = path.join(process.cwd(), relativePath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully");
                    }
                });
                const baseURL = `${req.protocol}://${req.get("host")}/uploads`;
                const file1Name = path.basename(req.fileUrl);
                await vehicleModel.updateOne({ _id: user.vehicle }, { $set: { pollution: { expair_date: data, docs: `${baseURL}/${file1Name}` } } });
                res.status(200).json({ message: "Docs updated successfully" });
                break;
            } default: {
                res.status(400).json({ message: "Invalid name" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserByExpairDate = async (req, res) => {
    const { name } = req.params;

    try {
        if (!["tax", "insurance", "pollution"].includes(name)) {
            return res.status(400).json({ message: "Invalid name" });
        }
        const today = new Date();
        const nextTwoMonths = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

        // Dynamic query (nested object field)
        const query = {
            [`${name}.expair_date`]: { $gte: today, $lte: nextTwoMonths }
        };
        const vehicles = await Vehicle.find(query).populate("user");
        res.status(200).json({ message: "Vehicles found", vehicles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};