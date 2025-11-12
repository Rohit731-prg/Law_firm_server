import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, require: true },//
    email: { type: String, require: true },//
    phone: { type: String, require: true },
    password: { type: String, require: true },//
    image: { type: String, require: true },
    blood_group: { type: String, require: true },
    address: { type: Object, require: true},
    pan: { type: Object, default: {
        number: "",
        docs: { type: String }
    }},
    aadhar: { type: Object, default: {
        number: "",
        docs: ""
    }},
    driving_licence: { type: Object, default: {
        expair_date: { type: Date },
        number: "",
        docs: ""
    }},
    referal_number: { type: Object, default: {
        number: "",
        relation: ""
    }},
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", require: true },
    role: { type: String, default: "user" },
    otp: { type: Number, default: "" },
    auth: { type: Boolean, default: false },
    verify: { type: Boolean, default: false },
    note: { type: String, default: "" },
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);