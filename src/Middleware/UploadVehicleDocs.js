import uploadFile from "../Config/MulterConfig.js";

export const uploadMiddlewareForDocs = uploadFile.fields([
    { name: "tax", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "pollution", maxCount: 1 },
]);

export const mapVFilesToReq = (req, res, next) => {
    if (!req.files) return res.status(400).json({ message: "No files uploaded" });
    req.file1 = req.files["tax"][0].path;
    req.file2 = req.files["insurance"][0].path;
    req.file3 = req.files["pollution"][0].path;
    next();
}