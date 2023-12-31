import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

dotenv.config();

//Api route function that is returned from next auth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        // credentials will be to passed from our login form
        // Your own logic here either check agains database or api endpoint
        // e.g. verify password if valid return user object.
        // Get the username and password details from the form
        const username = credentials?.username ?? "";
        const password = credentials?.password ?? "";

        // Database request to see if user exists
        const user = await prisma.user.findUnique({
          where: { email: username.toUpperCase() },
        });

        // If user then match the password
        if (user) {
          const isMatch = await compare(password, user.password);
          // If the passwords match then return the user object
          if (isMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    // called after sucessful signin
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.user = user;
      }
      return token;
    }, // called whenever session is checked
    session: async ({ session, token, user }) => {
      session.user.id = token.id;
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
      session.user = dbUser;
      session.user.password = undefined;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 Day
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
