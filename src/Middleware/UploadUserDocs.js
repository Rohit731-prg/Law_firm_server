import uploadFile from "../Config/MulterConfig.js";

export const uploadMiddleware = uploadFile.fields([
  { name: "pan", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },   // ✅ fixed spelling
  { name: "licence", maxCount: 1 },
]);

export const mapFilesToReq = (req, res, next) => {
  if (!req.files) return res.status(400).json({ message: "No files uploaded" });
  req.file1 = req.files["pan"][0].path;
  req.file2 = req.files["aadhar"][0].path;   // ✅ fixed spelling
  req.file3 = req.files["licence"][0].path;
  next();
};
