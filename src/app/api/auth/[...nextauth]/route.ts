import NextAuth from "next-auth";
import { handler } from "~/options/auth.option";

export const POST = NextAuth(handler);
export const GET = NextAuth(handler);
