"use client";

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { ExportView } from "@/components/export/ExportView";

export default function ExportPage() {
  const { inspirations, load } = useAppStore();

  const handleDeleteAll = useCallback(async () => {
    if (!confirm("确定要删除所有数据吗？此操作不可恢复。")) return;
    try {
      await Promise.all([
        fetch("/api/profile", { method: "DELETE", credentials: "include" }),
        fetch("/api/inspirations", { method: "DELETE", credentials: "include" }),
      ]);
    } catch {
      // ignore
    }
    window.location.href = "/";
  }, []);

  return (
    <ExportView
      inspirations={inspirations}
      onExportCsv={() => {}}
      onDeleteAll={handleDeleteAll}
    />
  );
}
