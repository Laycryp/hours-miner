"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready(); // أعلم المضيف أن الواجهة جاهزة
      } catch {
        // تجاهل: خارج الميني آب أو غير مدعوم
      }
    })();
  }, []);
  return null;
}
