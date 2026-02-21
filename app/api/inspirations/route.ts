import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { InspirationCard } from "@/lib/types";

function toCard(row: Record<string, unknown>): InspirationCard {
  return {
    id: row.id as string,
    meta: row.meta as InspirationCard["meta"],
    likePoints: (row.like_points as string[]) ?? [],
    note: (row.note as string) ?? undefined,
    highlightSummary: (row.highlight_summary as string) ?? "",
    reuseSuggestion: (row.reuse_suggestion as InspirationCard["reuseSuggestion"]) ?? {},
    aiBreakdown: row.ai_breakdown as InspirationCard["aiBreakdown"],
    embedding: row.embedding as number[] | undefined,
    createdAt: row.created_at as string,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ inspirations: [] }, { status: 200 });
  }

  const { data, error } = await supabaseAdmin
    .from("inspirations")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const inspirations = (data ?? []).map(toCard);
  return NextResponse.json({ inspirations });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const card = (await request.json()) as InspirationCard;

  const { error } = await supabaseAdmin.from("inspirations").insert({
    id: card.id,
    user_id: session.user.id,
    meta: card.meta,
    like_points: card.likePoints ?? [],
    note: card.note ?? null,
    highlight_summary: card.highlightSummary ?? "",
    reuse_suggestion: card.reuseSuggestion ?? {},
    ai_breakdown: card.aiBreakdown ?? null,
    embedding: card.embedding ?? null,
    created_at: card.createdAt,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("inspirations")
    .delete()
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
