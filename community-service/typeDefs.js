export const typeDefs = `#graphql
#graphql
type User {
  id: ID!
  username: String!
  email: String!
  role: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  category: String!
  createdAt: String
  author: User!
}

type HelpRequest {
  id: ID!
  description: String!
  location: String
  isResolved: Boolean!
  createdAt: String
  author: User!
  volunteers: [User!]!
}

type Query {
  getPosts: [Post]
  getHelpRequests: [HelpRequest]
}

type Mutation {
  createPost(author: ID!, title: String!, content: String!, category: String!): Post
  createHelpRequest(author: ID!, description: String!, location: String): HelpRequest
  joinHelpRequest(helpRequestId: ID!, userId: ID!): HelpRequest
  markHelpRequestResolved(helpRequestId: ID!): HelpRequest
}
`;
