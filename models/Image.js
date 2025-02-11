import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
