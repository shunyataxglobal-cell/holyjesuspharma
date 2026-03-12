import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import bcrypt from "bcryptjs";
import { isOTPExpired } from "@/lib/otp";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        try {
          await connectDB();

          const normalizedEmail = credentials.email.toLowerCase().trim();
          const user = await User.findOne({ email: normalizedEmail });
          if (!user) throw new Error("User does not exist sign up first");

          if (credentials.otp) {
            const otpRecord = await OTP.findOne({
              email: normalizedEmail,
              otp: credentials.otp.toString(),
            });
            if (!otpRecord) throw new Error("Invalid OTP");

            if (isOTPExpired(otpRecord.createdAt) || new Date() > otpRecord.expiresAt) {
              await OTP.findByIdAndDelete(otpRecord._id);
              throw new Error("OTP Expired");
            }

            await OTP.findByIdAndDelete(otpRecord._id);

            if (!user.verified) {
              user.verified = true;
              await user.save();
            }

            return {
              id: user._id.toString(),
              name: user.name || user.email.split("@")[0],
              email: user.email,
              role: user.role || "user",
            };
          }

          if (credentials.password) {
            if (!user.password) throw new Error("Invalid Login Method");

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordValid) throw new Error("Invalid password");

            return {
              id: user._id.toString(),
              name: user.name || user.email.split("@")[0],
              email: user.email,
              role: user.role || "user",
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id;
        (session.user as any).role = (token as any).role || "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

