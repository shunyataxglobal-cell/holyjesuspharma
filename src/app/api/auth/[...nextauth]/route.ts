import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import bcrypt from "bcryptjs";
import { isOTPExpired } from "@/lib/otp";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          await connectDB();

          const normalizedEmail = credentials.email.toLowerCase().trim();
          const user = await User.findOne({ email: normalizedEmail });

          if (!user) {
            return null;
          }

          if (credentials.otp) {
            const otpRecord = await OTP.findOne({
              email: normalizedEmail,
              otp: credentials.otp.toString(),
            });

            if (!otpRecord) {
              return null;
            }

            if (isOTPExpired(otpRecord.createdAt) || new Date() > otpRecord.expiresAt) {
              await OTP.findByIdAndDelete(otpRecord._id);
              return null;
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
            if (!user.password) {
              return null;
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!isPasswordValid) {
              return null;
            }

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
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "user";
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
});

export { handler as GET, handler as POST };