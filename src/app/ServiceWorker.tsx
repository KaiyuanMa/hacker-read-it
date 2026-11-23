"use client";
import { useEffect } from "react";

// Registers /sw.js so the app opens offline and keeps what you've read.
// Off in dev, where cached files would get in the way of hot reload.
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
