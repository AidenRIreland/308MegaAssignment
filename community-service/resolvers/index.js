import Post from "../models/Post.js";
import HelpRequest from "../models/HelpRequest.js";
import User from "../models/User.js"; // already added

export const resolvers = {
  Query: {
    getPosts: async () => await Post.find().populate("author").sort({ createdAt: -1 }),
    getHelpRequests: async () =>
      await HelpRequest.find()
        .populate("author")
        .populate("volunteers")
        .sort({ createdAt: -1 }),
  },
  Mutation: {
    createPost: async (_, { title, content, category, author }) => {
      const post = new Post({ title, content, category, author });
      await post.save();
      return post;
    },
    createHelpRequest: async (_, { author, description, location }) => {
      const help = new HelpRequest({ author, description, location });
      await help.save();
      return help;
    },
    joinHelpRequest: async (_, { helpRequestId, userId }) => {
      const helpRequest = await HelpRequest.findById(helpRequestId);
      if (!helpRequest.volunteers.includes(userId)) {
        helpRequest.volunteers.push(userId);
        await helpRequest.save();
      }
      return helpRequest.populate("author volunteers");
    },
    markHelpRequestResolved: async (_, { helpRequestId }) => {
      const helpRequest = await HelpRequest.findByIdAndUpdate(
        helpRequestId,
        { isResolved: true },
        { new: true }
      ).populate("author volunteers");
      return helpRequest;
    }
  }
};
