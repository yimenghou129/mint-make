import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

async function handler(req: Request, ...args: unknown[]) {
  try {
    return await (nextAuthHandler as (req: Request, ...a: unknown[]) => Promise<Response>)(req, ...args);
  } catch (e) {
    console.error("[next-auth]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Auth error" },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST };
