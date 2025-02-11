import dbConnect from "../../lib/dbConnect";
import Image from "../../models/Image";
import multer from "multer";
import cloudinary from "../../lib/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import nc from "next-connect";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

const handler = nc()
  .use(upload.single("image"))
  .post(async (req, res) => {
    await dbConnect();
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const newImage = new Image({
      imageUrl: req.file.path,
      date: new Date(date),
    });

    await newImage.save();
    res.status(201).json(newImage);
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
