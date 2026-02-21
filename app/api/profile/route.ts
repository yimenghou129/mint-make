import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { CreatorProfile } from "@/lib/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ profile: null }, { status: 200 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ profile: null }, { status: 200 });
  }

  const profile: CreatorProfile = {
    id: data.id,
    contentFields: data.content_fields ?? [],
    platforms: data.platforms ?? [],
    outputFormats: data.output_formats ?? [],
    description: data.description ?? "",
    styleKeywords: data.style_keywords ?? [],
    youtubeChannelUrl: data.youtube_channel_url ?? undefined,
    summary: data.summary ?? undefined,
    updatedAt: data.updated_at,
  };

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = (await request.json()) as CreatorProfile;
  const id = body.id || `profile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const { error } = await supabaseAdmin.from("profiles").upsert(
    {
      id,
      user_id: session.user.id,
      content_fields: body.contentFields ?? [],
      platforms: body.platforms ?? [],
      output_formats: body.outputFormats ?? [],
      description: body.description ?? "",
      style_keywords: body.styleKeywords ?? [],
      youtube_channel_url: body.youtubeChannelUrl ?? null,
      summary: body.summary ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

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
    .from("profiles")
    .delete()
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
