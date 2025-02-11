import dbConnect from "../../lib/dbConnect";
import Image from "../../models/Image";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const images = await Image.find();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: "Error fetching images" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
