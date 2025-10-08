import mongoose, { Schema } from "mongoose";

const InfoSchema = new Schema({
    type: { type: String, require: true },
    basic_info: { type: Object, require: true },
    state: { type: String, require: true },
    district: { type: String, require: true },
    sub_divition: { type: String, require: true },
    police_station: { type: String, require: true },
}, {
    timestamps: true
});

const Info = mongoose.model("Info", InfoSchema);
export default Info;