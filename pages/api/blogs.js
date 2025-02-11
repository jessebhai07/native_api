import dbConnect from "../../lib/dbConnect";
import Blog from "../../models/Blog";
import Counter from "../../models/Counter";
import multer from "multer";
import cloudinary from "../../lib/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { promisify } from "util";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });
const uploadMiddleware = promisify(upload.single("blog_image")); // Convert multer to promise-based

const getNextSequenceValue = async (sequenceName) => {
  await dbConnect();
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

export default async function handler(req, res) {
  await dbConnect(); // Ensure DB connection

  if (req.method === "POST") {
    try {
      // Handle file upload
      await uploadMiddleware(req, res);

      const { blog_title, blog_description } = req.body;
      const blog_image = req.file?.path; // Ensure file exists

      if (!blog_image) {
        return res.status(400).json({ error: "Blog image is required" });
      }

      const blog_id = await getNextSequenceValue("blog_id");

      const blog = new Blog({
        blog_id,
        blog_title,
        blog_description,
        blog_image,
      });

      await blog.save();

      // Fix: Convert `_id` to string before sending response
      return res.status(201).json({ ...blog.toObject(), _id: blog._id.toString() });
    } catch (error) {
      console.error("Error uploading blog:", error);
      return res.status(500).json({ error: "Error uploading blog" });
    }
  }

  if (req.method === "GET") {
    try {
      const blogs = await Blog.find();

      // Fix: Convert `_id` to string in all blogs
      const serializedBlogs = blogs.map((blog) => ({
        ...blog.toObject(),
        _id: blog._id.toString(),
      }));

      return res.status(200).json(serializedBlogs);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching blogs" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for multer
  },
};
