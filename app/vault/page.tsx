"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { VaultView } from "@/components/vault/VaultView";

export default function VaultPage() {
  const { inspirations } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("");

  return (
    <VaultView
      inspirations={inspirations}
      searchQuery={searchQuery}
      filterTab={filterTab}
      onSearchChange={setSearchQuery}
      onFilterChange={setFilterTab}
    />
  );
}
