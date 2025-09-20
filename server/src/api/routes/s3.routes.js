import express from "express";
import { generateUploadUrl, generateDownloadUrl } from "../controllers/s3Controller.js";

const router = express.Router();

// Frontend calls this to get a signed URL for uploading
router.post("/upload-url", generateUploadUrl);

// Frontend calls this to get a signed URL for downloading
router.post("/download-url", generateDownloadUrl);

export default router;
