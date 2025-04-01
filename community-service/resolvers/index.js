import Post from "../models/Post.js";

export const resolvers = {
  Query: {
    getPosts: async () => await Post.find().populate("author")
  },
  Mutation: {
    createPost: async (_, { title, content, category, author }) => {
      const post = new Post({ title, content, category, author });
      await post.save();
      return post;
    }
  }
};
