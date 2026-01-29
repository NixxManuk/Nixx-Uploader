import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  const file = req.query.id.replace(/\.[^/.]+$/, "");

  try {
    const data = await cloudinary.api.resource(`nixx/${file}`, {
      resource_type: "auto"
    });

    res.redirect(data.secure_url);
  } catch {
    res.status(404).send("File not found");
  }
}
