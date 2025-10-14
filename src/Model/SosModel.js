import mongoose, { Schema } from "mongoose";

const sosSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "accepted"] },
    type: { type: String, require: true, enum: ["send", "receive"] },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    reply: { type: String },
    location: { type: Object },
    location_data: { type: Object },
}, {
    timestamps: true
});

const Sos = mongoose.model("Sos", sosSchema);
export default Sos;