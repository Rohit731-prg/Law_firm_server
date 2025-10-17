import express from "express"
import { verifyToken } from "../Middleware/JwtMiddleware.js"
import { logger } from "../Middleware/Logger.js"
import { sendSingleNotice, sendSMSBulk } from "../Controller/UserController.js"

const router = express.Router()

router.post("/sendSingleNotice", verifyToken, logger, sendSingleNotice);
router.post("/sendBulkNotice", verifyToken, logger, sendSMSBulk);

export default router