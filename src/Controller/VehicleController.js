import Vehicle from "../Model/VehicleModel.js";
import path from "path";

export const addVehicle = async (req, res) => {
    const { number, engine_number, chasis_number, brand, mode, tax_expair_date, insurence_expair_date, pollution_expair_date } = req.body;
    if (!number || !engine_number || !chasis_number || !brand || !mode || !tax_expair_date || !insurence_expair_date || !pollution_expair_date ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const is_exist = await Vehicle.findOne({ number });
        if (is_exist) return res.status(400).json({ message: "Vehicle already exist" });

        const baseURL = `${req.protocol}://${req.get("host")}/uploads`
        const file1 = path.basename(req.file1);
        const file2 = path.basename(req.file2);
        const file3 = path.basename(req.file3);

        const newVehicle = new Vehicle();
        newVehicle.number = number;
        newVehicle.engine_number = engine_number;
        newVehicle.chasis_number = chasis_number;
        newVehicle.brand = brand;
        newVehicle.mode = mode;
        newVehicle.tax = { expair_date: tax_expair_date, docs: `${baseURL}/${file1}` };
        newVehicle.insurance = { expair_date: insurence_expair_date, docs: `${baseURL}/${file2}` };
        newVehicle.pollution = { expair_date: pollution_expair_date, docs: `${baseURL}/${file3}` };

        await newVehicle.save();
        res.status(201).json({ message: "Vehicle created successfully", id: newVehicle._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}