import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers/index.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use("/graphql", expressMiddleware(server));

app.listen(4001, () => console.log("Auth Service on port 4001"));
