import Info from "../Model/InfoModel.js";

export const createInfo = async (req, res) => {
    const { type, basic_info, state, district, sub_division, police_station } = req.body;
    if (!type || !basic_info || !state || !district || !sub_division || !police_station) return res.status(400).json({ message: "All fields are required" });
    try {
        const is_exist = await Info.findOne({ type, district, sub_division, police_station });
        if (is_exist) return res.status(400).json({ message: "Info already exist" });
        const newInfo = new Info({
            type, basic_info, state, district, sub_division, police_station
        });
        await newInfo.save();
        res.status(201).json({ message: "Info created successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const info = await Info.findById(id);
        if (!info) return res.status(400).json({ message: "Info not found" });

        await info.deleteOne({ _id: id });
        res.status(200).json({ message: "Info deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const filterByType = async (req, res) => {
    const { type } = req.body;
    if (!type) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.find({ type });
        if (!info) return res.status(400).json({ message: "Info not found" });
        if (info.length == 0) return res.status(400).json({ message: "No info found" });
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const filterByvalue = async (req, res) => {
    const { type, name, value } = req.body;
    if (!type || !name || !value) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.find({ type, [name]: value });
        if (!info) return res.status(400).json({ message: "Info not found" });
        if (info.length == 0) return res.status(400).json({ message: "No info found" });
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateInfo = async (req, res) => {
    const { id } = req.params;
    const { basic_info, district, sub_division, police_station } = req.body;
    if (!basic_info || !district || !sub_division || !police_station) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.findById(id);
        if (!info) return res.status(400).json({ message: "Info not found" });

        info.basic_info = basic_info;
        info.district = district;
        info.sub_division = sub_division;
        info.police_station = police_station;

        await info.save();
        res.status(200).json({ message: "Info updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getInfoByState = async (req, res) => {
    const { state } = req.body;
    if (!state) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.find({ state });
        if (!info) return res.status(400).json({ message: "Info not found" });
        if (info.length == 0) return res.status(400).json({ message: "No info found" });
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getInfoByDistrict = async (req, res) => {
    const { district } = req.body;
    if (!district) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.find({ district });
        if (!info) return res.status(400).json({ message: "Info not found" });
        if (info.length == 0) return res.status(400).json({ message: "No info found" });
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getInfoBySub_Division = async (req, res) => {
    const { sub_division } = req.body;
    if (!sub_division) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.find({ sub_division });
        if (!info) return res.status(400).json({ message: "Info not found" });
        if (info.length == 0) return res.status(400).json({ message: "No info found" });
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getInfoByPolice_Station = async (req, res) => {
    const { police_station } = req.body;
    if (!police_station) return res.status(400).json({ message: "All fields are required" });
    try {
        const info = await Info.find({ police_station });
        if (!info) return res.status(400).json({ message: "Info not found" });
        if (info.length == 0) return res.status(400).json({ message: "No info found" });
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const defaultDetails = async (req, res) => {
    const userAddress = req.user.address;
    console.log("userAddress: ", userAddress);
    try {
        const infos = await Info.find({
            state: userAddress.state,
            district: userAddress.district,
            sub_division: userAddress.sub_division,
        });
        if(!infos) return res.status(400).json({ message: "Info not found" });
        res.status(200).json({ infos });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const defaultDetailsWithFilter = async (req, res) => {
    const { type } = req.body;
    if (!type) return res.status(400).json({ message: "All fields are required" });
    if (!["Hospital", "Fire Brigade", "Ambulance", "Electricity", "Garage", "Police Station"].includes(type)) return res.status(400).json({ message: "type not found" });
    const userAddress = req.user.address;
    try {
        const infos = await Info.find({
            state: userAddress.state,
            district: userAddress.district,
            sub_division: userAddress.sub_division,
            type
        });
        if(!infos) return res.status(400).json({ message: "Info not found" });
        res.status(200).json({ infos });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
} 