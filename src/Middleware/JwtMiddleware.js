import jwt from "jsonwebtoken";
import AdminModel from "../Model/AdminModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        if (!req.cookies.token) return res.status(401).json({ message: "Unauthorized" });
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role == "admin") {
            const admin = await AdminModel.findOne({ _id: decoded.id, email: decoded.phone }).select("-password");
            if (!admin) return res.status(401).json({ message: "Unauthorized" });
            req.admin = admin;
        } else if (decoded.role == "user") {
            const user = await UserModel.findOne({ _id: decoded.id, phone: decoded.phone }).select("-password");
            if (!user) return res.status(401).json({ message: "Unauthorized" });
            req.user = user;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}