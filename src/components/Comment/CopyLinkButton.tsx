"use client";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { itemPath } from "@/lib/utils";
import LinkIcon from "../../../public/link.svg";

type Status = "idle" | "copied" | "failed";

const LABELS: Record<Status, string> = {
  idle: "Copy link",
  copied: "Copied",
  failed: "Couldn't copy",
};

// Copies the URL of a comment's own page, then shows the result for a moment.
export default function CopyLinkButton({ commentId }: { commentId: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const url = window.location.origin + itemPath(commentId);
    const copied = await copyText(url);
    setStatus(copied ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      onClick={copy}
      title="Copy a link to this comment"
      className="flex gap-2 items-center group"
    >
      <div className="w-4 text-text-secondary group-hover:text-text-primary">
        <LinkIcon />
      </div>
      <span
        aria-live="polite"
        className={`text-xs font-semibold group-hover:text-text-primary ${
          status === "copied" ? "text-text-primary" : "text-text-secondary"
        }`}
      >
        {LABELS[status]}
      </span>
    </button>
  );
}
