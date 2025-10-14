import AdminModel from "../Model/AdminModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/JwtGenerator.js";
import UserModel from "../Model/UserModel.js";
import Sos from "../Model/SosModel.js";
import Info from "../Model/InfoModel.js";


export const createAdmin = async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password ) return res.status(400).json({ message: "All fields are required" });
    if (!req.fileUrl) return res.status(400).json({ message: "Image is required" });
    try {
        const is_exist = await AdminModel.findOne({ email });
        if (is_exist) return res.status(400).json({ message: "Admin already exist" });

        const hasedPassword = await bcrypt.hash(password, 12);
        const newAdmin = new AdminModel({
            name, email, phone, password: hasedPassword, image: req.fileUrl
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });
    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);        
        if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

        const token = generateToken(admin._id, admin.email, admin.role);   
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", admin });
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

export const makeUserAuth = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.verify) return res.status(400).json({ message: "User not verify mobile number" });
        if (user.auth === true) return res.status(400).json({ message: "User already authorized" });
        user.auth = true;
        await user.save();
        res.status(200).json({ message: "User authorized successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllAdmins = async (req, res) => {
    try {
        const admin = req.admin;
        
        const admins = await AdminModel.find({ _id: { $ne: admin._id }}).select("-password");
        if (admins.length === 0) return res.status(400).json({ message: "No admin found" });

        res.status(200).json({ message: "Admins fetched successfully", admins });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Admin ID is required" });
    try {
        const admin = await AdminModel.findById(id);
        if (!admin) return res.status(400).json({ message: "Admin not found" });
        await AdminModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginWithTokne = async (req, res) => {
    try {
        const admin = req.admin;
        const token = generateToken(admin._id, admin.email, admin.role);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const rejectUser = async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    if ( !note ) return res.status(400).json({ message: "Note is required" });

    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.auth === true) return res.status(400).json({ message: "User already authorized" });

        user.note = note;
        await user.save();
        res.status(200).json({ message: "User rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const basicInfo = async (req, res) => {
    try {
        const user = await UserModel.countDocuments({ auth: true });
        const lead = await UserModel.countDocuments({ auth: false, note : "" });
        const sos = await Sos.countDocuments({ status: "pending" });
        const external = await Info.countDocuments();

        const sosList = await Sos.find().limit(5).sort({ createdAt: -1 }).populate("user");
        const externalList = await Info.find().limit(5).sort({ createdAt: -1 });
        const userList = await UserModel.find({ auth: true }).limit(5).sort({ createdAt: -1 });
        const leadList = await UserModel.find({ auth: false, note : "" }).limit(5).sort({ createdAt: -1 });

        res.status(200).json({ user, lead, sos, external, sosList, externalList, userList, leadList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}