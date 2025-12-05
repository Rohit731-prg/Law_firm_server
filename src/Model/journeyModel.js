import mongoose, { Schema } from "mongoose";

const JourneySchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User" },
    vehicleID: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    start: { type: Object, require: true, default: { latitude: 0, longitude: 0, timeStamp: "" } },
    end: { type: Object, default: null },
    journeyList: { type: Array },
    is_delete: { type: Boolean },
}, {
    timestamps: true
});

export default mongoose.model("Journey", JourneySchema);