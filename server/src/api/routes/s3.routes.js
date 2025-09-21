import express from "express";
import { generateUploadUrl, generateDownloadUrl } from "../controllers/s3.controller.js";

const router = express.Router();

router.post("/upload-url", generateUploadUrl);
router.post("/download-url", generateDownloadUrl);

export default router;
