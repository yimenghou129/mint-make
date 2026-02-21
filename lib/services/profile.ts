import type { CreatorProfile } from "@/lib/types";

export async function loadProfile(): Promise<CreatorProfile | null> {
  try {
    const res = await fetch("/api/profile", { credentials: "include" });
    const data = (await res.json()) as { profile?: CreatorProfile | null };
    return data.profile ?? null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: CreatorProfile): Promise<void> {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "保存失败");
  }
}

export async function hasProfile(): Promise<boolean> {
  const p = await loadProfile();
  return p != null;
}
