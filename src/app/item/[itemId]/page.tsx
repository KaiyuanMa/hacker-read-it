"use client";
import { useEffect, useState } from "react";
import { getItem } from "@/lib/api";
import { BaseItem, CommentItem } from "@/lib/types";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import StoryThread from "@/components/StoryThread";
import CommentThread from "@/components/CommentThread";

// HN gives posts and comments ids from the same sequence, so /item/<id> serves
// both: a post shows with its comments, a comment with its replies.
export default function Item({ params }: { params: { itemId: string } }) {
  // undefined = still loading, null = no such item
  const [item, setItem] = useState<BaseItem | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setItem(undefined);
    setError(false);

    if (!/^\d+$/.test(params.itemId)) {
      setItem(null);
      return;
    }
    getItem(params.itemId)
      .then((_item) => {
        if (!cancelled) setItem(_item ?? null);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [params.itemId]);

  if (error) {
    return (
      <EmptyState
        title="Couldn't load this page"
        lines={[
          "Something went wrong talking to Hacker News.",
          "Try refreshing the page.",
        ]}
      />
    );
  }
  if (item === undefined) return <Loading />;
  if (item === null) {
    return (
      <EmptyState
        title="Nothing here"
        lines={["There's no Hacker News post or comment with this id."]}
      />
    );
  }
  if (item.type === "comment") {
    return <CommentThread comment={item as CommentItem} />;
  }
  return <StoryThread story={item} />;
}
