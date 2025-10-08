import fs from "fs";
import path from "path";

const logfile_path = path.join(process.cwd(), "logs", "server.log");

export const logger = (req, res, next) => {
    const now = new Date();
    const localTime = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const name = req?.user ? req.user.name : req?.admin ? req.admin.name : "Guest";
    const logEntry = `[${localTime}] - ${req.method} - ${name} - ${req.url}\n`;

    const logsDir = path.dirname(logfile_path);
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFile(logfile_path, logEntry, (err) => {
        if (err) console.error("Error writing to log file", err);
    });
    next();
}