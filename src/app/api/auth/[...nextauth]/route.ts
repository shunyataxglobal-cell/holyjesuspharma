import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { ObjectId } from "mongodb";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.userId) {
          return null;
        }

        try {
          await connectDB();

          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
            _id: new ObjectId(credentials.userId),
          });

          if (user) {
            return {
              id: user._id.toString(),
              name: user.name || user.email.split("@")[0],
              email: user.email,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };