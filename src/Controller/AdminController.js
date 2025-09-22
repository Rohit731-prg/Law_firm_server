import AdminModel from "../Model/AdminModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/JwtGenerator.js";
import UserModel from "../Model/UserModel.js";


export const createAdmin = async (req, res) => {
    console.log(req.body);
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

export const logout = async () => {
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
        console.log(admin);
        
        const admins = await AdminModel.find({ _id: { $ne: admin._id }}).select("-password");
        if (admins.length === 0) return res.status(400).json({ message: "No admin found" });

        res.status(200).json({ message: "Admins fetched successfully", admins });
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