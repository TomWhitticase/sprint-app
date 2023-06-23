import NextAuth from "next-auth";
//default next auth session type does not include user id so this is adds it

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
