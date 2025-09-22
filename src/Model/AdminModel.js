import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    password: { type: String, require: true },
    image: { type: String, require: true },
    role: { type: String, default: "admin" },
}, {
    timestamps: true
});

export default mongoose.model("Admin", adminSchema);