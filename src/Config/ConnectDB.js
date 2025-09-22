import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const host = await mongoose.connect(process.env.DB_URL);
        console.log("Database connected", host.connection.host);
    } catch (error) {
        console.log("Error from database", error);
    }
}