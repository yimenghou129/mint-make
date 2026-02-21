"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import { DetailView } from "@/components/detail/DetailView";

export default function DetailPage() {
  const params = useParams();
  const { getInspiration } = useAppStore();
  const id = typeof params.id === "string" ? params.id : "";

  const card = useMemo(() => getInspiration(id), [getInspiration, id]);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-zinc-600">缺少 id</p>
          <Link href="/vault" className="mt-2 inline-block text-sm underline">
            返回灵感库
          </Link>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-zinc-600">未找到该灵感</p>
          <Link href="/vault" className="mt-2 inline-block text-sm underline">
            返回灵感库
          </Link>
        </div>
      </div>
    );
  }

  return <DetailView card={card} />;
}
