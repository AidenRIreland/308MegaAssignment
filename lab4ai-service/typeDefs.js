export const typeDefs = `#graphql
  type CommunityPost {
    id: ID
    title: String
    content: String
    author: String
  }

  type AIResponse {
    text: String!
    suggestedQuestions: [String]!
    retrievedPosts: [CommunityPost]
  }

  type Query {
    communityAIQuery(input: String!): AIResponse!
  }
`;
