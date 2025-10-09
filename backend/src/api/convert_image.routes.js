import { Router } from "express";
import { IncomingForm } from "formidable";
import { readFileSync } from "fs";
import sharp from "sharp";
const router = Router();

// POST /api/convert_image
router.post("/", (req, res) => {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error parsing form data" });
    }
    let file = files.image;
    if (Array.isArray(file)) file = file[0];
    if (!file || typeof file.filepath !== "string") {
      return res.status(400).json({ error: "No image file provided" });
    }
    try {
      const originalName = file.originalFilename || "image";
      const ext = originalName.split(".").pop()?.toLowerCase();
      const isWebp = ext === "webp" || file.mimetype === "image/webp";
      if (isWebp) {
        // Return the original file as-is
        const fileBuffer = readFileSync(file.filepath);
        res.setHeader("Content-Type", "image/webp");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${originalName}"`
        );
        res.status(200).send(fileBuffer);
      } else {
        // Add watermark and convert to webp
        const inputBuffer = readFileSync(file.filepath);
        let watermarkBuffer = null;
        let compositeOptions = null;
        const image = sharp(inputBuffer);
        let outputBuffer;
        if (fields.watermarkUrl) {
          // Fetch watermark image from URL
          const response = await fetch(fields.watermarkUrl);
          if (!response.ok) throw new Error("Failed to fetch watermark image");
          watermarkBuffer = Buffer.from(await response.arrayBuffer());
          // Get main image metadata
          const metadata = await image.metadata();
          const mainWidth = metadata.width || 800; // fallback if missing
          // Resize watermark to 30% of main image width
          const watermarkResized = await sharp(watermarkBuffer)
            .resize(Math.round(mainWidth * 0.3))
            .toBuffer();
          compositeOptions = {
            input: watermarkResized,
            gravity: "center",
            blend: "over",
            opacity: 0.3,
          };
          outputBuffer = await image
            .composite([compositeOptions])
            .webp()
            .toBuffer();
        } else {
          // No watermark, just convert to webp
          outputBuffer = await image.webp().toBuffer();
        }
        const webpName = originalName.replace(/\.[^.]+$/, ".webp");
        res.setHeader("Content-Type", "image/webp");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${webpName}"`
        );
        res.status(200).send(outputBuffer);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Image conversion failed", details: error.message });
    }
  });
});

export default router;
