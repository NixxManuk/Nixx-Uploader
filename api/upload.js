import formidable from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: "No file" });

    const id = nanoid(7);

    try {
      const up = await cloudinary.uploader.upload(file.filepath, {
        resource_type: "auto",
        public_id: `nixx/${id}`
      });

      fs.unlinkSync(file.filepath);

      const ext = up.format || "bin";
      const short = `${process.env.BASE_URL}/api/f/${id}.${ext}`;

      res.json({
        status: true,
        url: short,
        original: up.secure_url,
        type: up.resource_type
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}