import { runCommunityAI } from "../langchainAgent.js";

export const resolvers = {
  Query: {
    communityAIQuery: async (_, { input }) => {
      const aiResult = await runCommunityAI(input);
      return aiResult;
    }
  }
};
