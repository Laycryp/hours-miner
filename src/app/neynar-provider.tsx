"use client";

import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";

const CLIENT_ID = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "";

export default function NeynarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeynarContextProvider
      settings={{
        clientId: CLIENT_ID,
        defaultTheme: Theme.Light,
        eventsCallbacks: {
          onAuthSuccess: () => {},
          onSignout() {},
        },
      }}
    >
      {children}
    </NeynarContextProvider>
  );
}
