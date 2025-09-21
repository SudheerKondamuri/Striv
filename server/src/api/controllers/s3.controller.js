import { getUploadUrl, getDownloadUrl } from "../../services/s3Service.js";

export async function generateUploadUrl(req, res) {
  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) return res.status(400).json({ message: "fileName and fileType required" });

    const uploadUrl = await getUploadUrl(fileName, fileType);
    res.json({ uploadUrl });
  } catch (err) {
    console.error("S3 upload URL error:", err);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
}

export async function generateDownloadUrl(req, res) {
  try {
    const { fileName } = req.body;
    if (!fileName) return res.status(400).json({ message: "fileName required" });

    const downloadUrl = await getDownloadUrl(fileName);
    res.json({ downloadUrl });
  } catch (err) {
    console.error("S3 download URL error:", err);
    res.status(500).json({ message: "Failed to generate download URL" });
  }
}
