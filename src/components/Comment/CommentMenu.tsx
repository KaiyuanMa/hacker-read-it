"use client";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { itemPath } from "@/lib/utils";
import Dots from "../../../public/dots.svg";

type CopyStatus = "idle" | "copied" | "failed";

const COPY_LABELS: Record<CopyStatus, string> = {
  idle: "Copy link",
  copied: "Copied",
  failed: "Couldn't copy",
};

// The "⋯" after a comment's age. Opens a small list of actions; for now that's
// copying the link to the comment's own page.
export default function CommentMenu({ commentId }: { commentId: number }) {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  // Close on a tap outside the menu or on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    clearTimeout(timer.current);
    setCopyStatus("idle");
    setOpen((pre) => !pre);
  }

  async function copyLink() {
    const copied = await copyText(window.location.origin + itemPath(commentId));
    setCopyStatus(copied ? "copied" : "failed");
    // Leave the result on screen for a moment, then close.
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpen(false);
      setCopyStatus("idle");
    }, 1200);
  }

  return (
    <div ref={rootRef} className="relative flex items-center">
      <button
        onClick={toggle}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="tap-target w-4 text-text-tertiary hover:text-text-primary"
      >
        <Dots />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full mt-2 z-30 min-w-[9rem] py-1 rounded-md border border-border-tertiary bg-background-hover shadow-lg"
        >
          <button
            role="menuitem"
            onClick={copyLink}
            className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-nav-button-background-hover"
          >
            <span aria-live="polite">{COPY_LABELS[copyStatus]}</span>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
