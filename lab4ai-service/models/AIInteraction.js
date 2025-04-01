import mongoose from "mongoose";

const aiInteractionSchema = new mongoose.Schema({
  input: { type: String, required: true },
  response: { type: String, required: true },
  suggestedQuestions: [String],
  retrievedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AIInteraction", aiInteractionSchema);
