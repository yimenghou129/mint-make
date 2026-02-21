"use client";

import { useCallback, useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  getRecommendedInspirations,
  getGeneratedPlans,
  type FindCardType,
} from "@/lib/services/find";
import { FindView } from "@/components/find/FindView";
import type { GeneratedPlan } from "@/lib/types";

export default function FindPage() {
  const { inspirations } = useAppStore();
  const [query, setQuery] = useState("");
  const [cardType, setCardType] = useState<FindCardType>("封面");
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [recommended, setRecommended] = useState<typeof inspirations>([]);
  const [plans, setPlans] = useState<GeneratedPlan[]>([]);

  const handleGetRecommendations = useCallback(() => {
    setLoading(true);
    setHasResults(false);
    // 模拟短暂延迟，便于展示 loading
    setTimeout(() => {
      setRecommended(getRecommendedInspirations(inspirations, cardType));
      setPlans(getGeneratedPlans(query, cardType));
      setHasResults(true);
      setLoading(false);
    }, 400);
  }, [inspirations, cardType, query]);

  const handleCopyPlan = useCallback((plan: GeneratedPlan) => {
    const text = `${plan.title}\n${plan.description}`;
    void navigator.clipboard?.writeText(text);
  }, []);

  return (
    <FindView
      query={query}
      onQueryChange={setQuery}
      cardType={cardType}
      onCardTypeChange={setCardType}
      onGetRecommendations={handleGetRecommendations}
      loading={loading}
      hasResults={hasResults}
      recommended={recommended}
      plans={plans}
      onCopyPlan={handleCopyPlan}
    />
  );
}
