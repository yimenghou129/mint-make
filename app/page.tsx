"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LandingView } from "@/components/landing/LandingView";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profile, hasLoaded } = useAppStore();

  // 已登录且已加载 store：未建档则去 onboarding，否则留在落地页
  useEffect(() => {
    if (status !== "authenticated" || !hasLoaded) return;
    if (!profile) {
      router.replace("/onboarding");
    }
  }, [status, hasLoaded, profile, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-zinc-500">加载中…</p>
      </div>
    );
  }

  return (
    <LandingView
      isLoggedIn={status === "authenticated"}
      hasProfile={!!profile}
    />
  );
}
