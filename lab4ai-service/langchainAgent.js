import mongoose from "mongoose";
import CommunityPost from "./models/Post.js";
import AIInteraction from "./models/AIInteraction.js";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { RunnablePassthrough, RunnableMap } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/COMP308MEGA");

// Fetch posts
const posts = await CommunityPost.find();
const docs = posts.map(
  (post) =>
    new Document({
      pageContent: `${post.title}: ${post.content}`,
      metadata: { id: post._id.toString(), author: post.author.toString() },
    })
);

// Embedding Model
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "models/embedding-001",
});

// Vector Store
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Retriever
const retriever = vectorStore.asRetriever();

// LLM
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// Chain Logic (v0.2+)
const chain = RunnablePassthrough.assign({
  context: async (input) => retriever.invoke(input),
}).pipe(
  RunnableMap.from({
    answer: async (data) => {
      const retrievedDocs = data.context;
      const contextText = retrievedDocs.map((d) => d.pageContent).join("\n");
      const prompt = `You are a helpful community assistant.\n\nContext:\n${contextText}\n\nQuestion:\n${data.input}`;
      const result = await model.invoke(prompt);
      return result.content;
    },
  })
);

// Run AI
export async function runCommunityAI(input) {
  const result = await chain.invoke({ input });

  const aiInteraction = await AIInteraction.create({
    input,
    response: result.answer,
    suggestedQuestions: [
      "Would you like more info?",
      "Do you want a summary of similar posts?",
    ],
    retrievedPosts: posts.map((p) => p._id),
  });

  return {
    text: aiInteraction.response,
    suggestedQuestions: aiInteraction.suggestedQuestions,
    retrievedPosts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
    })),
  };
}
