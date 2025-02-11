import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  blog_id: { type: Number, unique: true },
  blog_title: String,
  blog_description: String,
  blog_image: String,
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
