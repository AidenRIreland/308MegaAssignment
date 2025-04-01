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
  }

  type Query {
    hello: String
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!, role: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
