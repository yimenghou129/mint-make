"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { CreatorProfile } from "@/lib/types";
import { OnboardingView, type OnboardingFormState } from "@/components/onboarding/OnboardingView";
import { useEffect, useState } from "react";

function defaultForm(): OnboardingFormState {
  return {
    contentFields: [],
    platforms: [],
    outputFormats: [],
    description: "",
    styleKeywords: [],
    youtubeChannelUrl: "",
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, saveProfile } = useAppStore();
  const [form, setForm] = useState<OnboardingFormState>(defaultForm);

  useEffect(() => {
    if (profile) {
      setForm({
        contentFields: profile.contentFields,
        platforms: profile.platforms,
        outputFormats: profile.outputFormats,
        description: profile.description,
        styleKeywords: profile.styleKeywords ?? [],
        youtubeChannelUrl: profile.youtubeChannelUrl ?? "",
      });
    }
  }, [profile]);

  const onFieldChange = <K extends keyof OnboardingFormState>(
    field: K,
    value: OnboardingFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onToggle = (
    field: "contentFields" | "platforms" | "outputFormats" | "styleKeywords",
    item: string
  ) => {
    setForm((prev) => {
      const arr = prev[field] as readonly string[];
      const next = arr.includes(item)
        ? arr.filter((x) => x !== item)
        : [...arr, item];
      return { ...prev, [field]: next };
    });
  };

  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError(null);
    const now = new Date().toISOString();
    const p: CreatorProfile = {
      id: profile?.id ?? `profile-${Date.now()}`,
      contentFields: form.contentFields,
      platforms: form.platforms,
      outputFormats: form.outputFormats,
      description: form.description,
      styleKeywords: form.styleKeywords.length ? form.styleKeywords : undefined,
      youtubeChannelUrl: form.youtubeChannelUrl || undefined,
      summary: profile?.summary,
      updatedAt: now,
    };
    try {
      await saveProfile(p);
      router.push("/");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const canSubmit =
    form.contentFields.length > 0 &&
    form.platforms.length > 0 &&
    form.description.trim().length > 0;

  return (
    <OnboardingView
      form={form}
      onFieldChange={onFieldChange}
      onToggle={onToggle}
      onSubmit={handleSubmit}
      canSubmit={canSubmit && !saving}
      saving={saving}
      submitError={submitError}
      backHref="/"
    />
  );
}
