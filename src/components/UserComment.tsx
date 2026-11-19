"use client";
import { useEffect, useState } from "react";
import { BaseItem } from "@/lib/types";
import { findRootStory, timeAgo } from "@/lib/utils";
import UserName from "@/components/UserName";

// One comment in a user's history, with the story it was posted on.
export default function UserComment({ comment }: { comment: BaseItem }) {
  const [story, setStory] = useState<BaseItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    findRootStory(comment).then((root) => {
      if (!cancelled) setStory(root);
    });
    return () => {
      cancelled = true;
    };
  }, [comment]);

  // Until the story is found, the card opens the comment's parent.
  const threadHref = `/item/${story?.id ?? comment.parent}`;

  return (
    <div className="flex flex-col w-full gap-2 py-4 h-fit relative p-1">
      <a href={threadHref} className="absolute inset-0" />
      <div className="flex flex-wrap items-center gap-x-2 text-text-tertiary text-sm">
        <UserName username={comment.by} />
        <span className="font-light">commented on</span>
        {story ? (
          <a
            href={`/item/${story.id}`}
            className="relative font-semibold text-text-primary hover:underline truncate max-w-full"
          >
            {story.title || "a deleted post"}
          </a>
        ) : (
          <span className="font-light">…</span>
        )}
        <span className="font-light">{timeAgo(comment.time)}</span>
      </div>
      {comment.text ? (
        <div
          className="story-text | text-sm text-text-primary font-light"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
