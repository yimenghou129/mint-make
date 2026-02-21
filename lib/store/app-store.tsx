"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CreatorProfile, InspirationCard } from "@/lib/types";
import * as profileService from "@/lib/services/profile";
import * as inspirationService from "@/lib/services/inspiration";

interface AppStoreValue {
  profile: CreatorProfile | null;
  inspirations: InspirationCard[];
  hasLoaded: boolean;
  setProfile: (p: CreatorProfile | null) => void;
  saveProfile: (p: CreatorProfile) => Promise<void>;
  addInspiration: (card: InspirationCard) => Promise<void>;
  getInspiration: (id: string) => InspirationCard | null;
  load: () => Promise<void>;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<CreatorProfile | null>(null);
  const [inspirations, setInspirations] = useState<InspirationCard[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const load = useCallback(async () => {
    const [profileData, inspData] = await Promise.all([
      profileService.loadProfile(),
      inspirationService.listInspirations(),
    ]);
    setProfileState(profileData);
    setInspirations(inspData);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setProfile = useCallback((p: CreatorProfile | null) => {
    setProfileState(p);
    if (p) {
      profileService.saveProfile(p).catch(console.error);
    }
  }, []);

  const saveProfile = useCallback(async (p: CreatorProfile) => {
    setProfileState(p);
    await profileService.saveProfile(p);
  }, []);

  const addInspiration = useCallback(async (card: InspirationCard) => {
    await inspirationService.addInspiration(card);
    const list = await inspirationService.listInspirations();
    setInspirations(list);
  }, []);

  const getInspiration = useCallback(
    (id: string) => inspirations.find((i) => i.id === id) ?? null,
    [inspirations]
  );

  const value: AppStoreValue = {
    profile,
    inspirations,
    hasLoaded,
    setProfile,
    saveProfile,
    addInspiration,
    getInspiration,
    load,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return ctx;
}
