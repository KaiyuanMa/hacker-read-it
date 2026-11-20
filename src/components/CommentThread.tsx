"use client";
import { useEffect, useState } from "react";
import { BaseItem, CommentItem } from "@/lib/types";
import { findRootStory, itemPath } from "@/lib/utils";
import Comment from "@/components/Comment/Comment";

const linkButton =
  "rounded-full px-4 py-1 border border-border-secondary text-sm font-medium hover:border-border-button-hover";

// A comment's own page: the post it was made on, then the comment with every
// reply under it, in the same tree UI as a post page.
export default function CommentThread({ comment }: { comment: CommentItem }) {
  // undefined = still looking, null = couldn't find the post
  const [story, setStory] = useState<BaseItem | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setStory(undefined);
    findRootStory(comment).then((root) => {
      if (!cancelled) setStory(root);
    });
    return () => {
      cancelled = true;
    };
  }, [comment]);

  // A reply to another comment also gets a link one level up.
  const repliesToComment = story != null && comment.parent !== story.id;

  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-text-tertiary font-light">Comment on</div>
        {story === undefined ? (
          <h2 className="font-semibold text-xl sm:text-2xl text-text-tertiary">
            …
          </h2>
        ) : story === null ? (
          <h2 className="text-xl sm:text-2xl text-text-tertiary italic">
            a post that couldn&apos;t be found
          </h2>
        ) : story.deleted || !story.title ? (
          <h2 className="text-xl sm:text-2xl text-text-tertiary italic">
            a deleted post
          </h2>
        ) : (
          <h2 className="font-semibold text-xl sm:text-2xl break-words">
            <a href={itemPath(story.id)} className="hover:underline">
              {story.title}
            </a>
          </h2>
        )}
        {story ? (
          <div className="flex flex-wrap gap-2">
            <a href={itemPath(story.id)} className={linkButton}>
              View full discussion
            </a>
            {repliesToComment ? (
              <a href={itemPath(comment.parent)} className={linkButton}>
                View parent comment
              </a>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Comment
          commentItem={comment}
          parentIsComment={false}
          isLastChildren={false}
          layersDeepFromLoad={0}
          expandAll
        />
      </div>
    </div>
  );
}
