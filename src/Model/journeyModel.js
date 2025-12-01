import mongoose, { Schema } from "mongoose";

const JourneySchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User" },
    vehicleID: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    start: { type: Object, require: true, default: { latitude: "", longitude: "", timeStamp: "" } },
    end: { type: Object, default: {
        latitude: "",
        longitude: "",
        timeStamp: ""
    }},
    journeyList: { type: Array },
    is_delete: { type: Boolean },
});

export default mongoose.model("Journey", JourneySchema);