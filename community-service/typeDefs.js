export const typeDefs = `#graphql
  type CommunityPost {
    id: ID!
    title: String!
    content: String!
    category: String!
    author: String!
    aiSummary: String
    createdAt: String
  }

  type Query {
    getPosts: [CommunityPost]
  }

  type Mutation {
    createPost(title: String!, content: String!, category: String!, author: String!): CommunityPost!
  }
`;
