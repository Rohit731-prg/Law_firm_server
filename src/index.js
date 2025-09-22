import "dotenv/config";
import express from "express";
import cors from "cors";
import cookie from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./Config/ConnectDB.js";
import AdminRouter from "./Router/AdminRouter.js";
import UserRouter from "./Router/UserRouter.js";
import VehicleRouter from "./Router/VehicleRouter.js";

const app = express();
const port = process.env.PORT || 5000;

// For __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "2mb",
  })
);
app.use(cookie());

// ✅ Serve uploads folder (important for docs/images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", AdminRouter);
app.use("/api/user", UserRouter);
app.use("/api/vehicle", VehicleRouter);

// DB + Server
connectDB().then(() => {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
});