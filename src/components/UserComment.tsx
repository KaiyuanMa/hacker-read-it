"use client";
import { useEffect, useState } from "react";
import { BaseItem } from "@/lib/types";
import { findRootStory, itemPath, timeAgo } from "@/lib/utils";
import UserName from "@/components/UserName";

// One comment in a user's history, with the story it was posted on.
export default function UserComment({ comment }: { comment: BaseItem }) {
  // undefined = still looking, null = couldn't find the story
  const [story, setStory] = useState<BaseItem | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    findRootStory(comment).then((root) => {
      if (!cancelled) setStory(root);
    });
    return () => {
      cancelled = true;
    };
  }, [comment]);

  return (
    <div className="flex flex-col w-full gap-2 py-4 h-fit relative p-1">
      {/* The card opens the comment's own page; the title opens the post. */}
      <a
        href={itemPath(comment.id)}
        className="absolute inset-0"
        aria-label="Open comment"
      />
      <div className="flex flex-wrap items-center gap-x-2 text-text-tertiary text-sm">
        <UserName username={comment.by} />
        <span className="font-light">commented on</span>
        {story === undefined ? (
          <span className="font-light">…</span>
        ) : story === null || story.deleted || !story.title ? (
          <span className="font-light italic">a deleted post</span>
        ) : (
          <a
            href={itemPath(story.id)}
            className="relative font-semibold text-text-primary hover:underline truncate max-w-full"
          >
            {story.title}
          </a>
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
