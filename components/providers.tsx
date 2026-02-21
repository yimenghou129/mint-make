"use client";

import { SessionProvider } from "next-auth/react";
import { AppStoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </SessionProvider>
  );
}
