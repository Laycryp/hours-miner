"use client";

import { NeynarAuthButton, useNeynarContext } from "@neynar/react";

export default function FarcasterSignIn() {
  const { user } = useNeynarContext();

  return (
    <div className="flex items-center gap-3">
      <NeynarAuthButton />
      {user && (
        <span className="text-xs text-muted">
          {user.username ? `@${user.username}` : `fid ${user.fid}`}
        </span>
      )}
    </div>
  );
}
