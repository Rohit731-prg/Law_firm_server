import mongoose, { Schema } from "mongoose";

const VehicleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    number: { type: String, required: true },
    engine_number: { type: String, required: true },
    chasis_number: { type: String, required: true },
    brand: { type: String, required: true },
    mode: { type: String, required: true },
    tax: {
        expair_date: { type: Date },
        docs: { type: String }
    },
    insurance: {
        expair_date: { type: Date },
        docs: { type: String }
    },
    pollution: {
        expair_date: { type: Date },
        docs: { type: String }
    },
}, {
    timestamps: true
});


const Vehicle = mongoose.model("Vehicle", VehicleSchema);
export default Vehicle;