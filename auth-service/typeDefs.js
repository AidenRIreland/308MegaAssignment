export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!  # <-- This was missing
  }

  type Query {
    hello: String
  }

  type Mutation {
  signup(username: String!, email: String!, password: String!, role: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
  }

`;
