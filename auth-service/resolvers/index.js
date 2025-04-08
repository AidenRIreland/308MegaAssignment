import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // <-- You missed this in your current file!

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

export const resolvers = {
  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already in use");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword, role });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    },
  },
};
