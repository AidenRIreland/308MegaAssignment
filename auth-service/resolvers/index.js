import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const resolvers = {
  Query: {
    hello: () => "Auth Service Working"
  },
  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashed, role });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return { token };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return { token };
    }
  }
};
