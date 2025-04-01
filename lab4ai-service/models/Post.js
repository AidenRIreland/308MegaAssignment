import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  category: String,
  aiSummary: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("CommunityPost", postSchema);
