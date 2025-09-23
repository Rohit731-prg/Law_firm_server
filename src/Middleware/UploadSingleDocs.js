import uploadFile from "../Config/MulterConfig.js";

// ✅ Handle a single file with field name "file"
export const uploadSingleMiddleware = uploadFile.single("file");

// ✅ Map uploaded file path into req.fileUrl
export const mapFileToReq = (req, res, next) => {
  if (!req.file) {
    console.log("file from multer: ", req.file);
    return res.status(400).json({ message: "No file uploaded" });
  }

  req.fileUrl = req.file.path;
  next();
};
