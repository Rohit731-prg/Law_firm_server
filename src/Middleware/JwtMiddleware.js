import jwt from "jsonwebtoken";
import AdminModel from "../Model/AdminModel.js";
import UserModel from "../Model/UserModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        // ✅ 1. Try to get token from cookie or header
        const token =
            req.cookies?.token ||
            req.headers["authorization"]?.split(" ")[1]; // Format: "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Token missing" });
        }

        // ✅ 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ 3. Check role and attach user/admin to request
        if (decoded.role === "admin" || decoded.role === "employee") {
            const admin = await AdminModel.findOne({
                _id: decoded.id,
                email: decoded.email || decoded.phone,
            }).select("-password");

            if (!admin) return res.status(401).json({ message: "Unauthorized - Invalid admin" });

            req.admin = admin;
        } else if (decoded.role === "user") {
            const user = await UserModel.findOne({
                _id: decoded.id,
                phone: decoded.phone,
            }).select("-password");

            if (!user || !user.auth)
                return res.status(401).json({ message: "Unauthorized - Invalid user" });

            req.user = user;
        }
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(500).json({ message: "Invalid or expired token" });
    }
};
