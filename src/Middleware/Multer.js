import multer from "multer";
import cloudinary from "../Config/CloudinaryConfig.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'Low'
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(fileBuffer);
            });
        };

        const result = await streamUpload(req.file.buffer);
        req.fileUrl = result.secure_url; // store url for next middleware
        req.fileId = result.public_id; // store public_id for next middleware
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};