"use client";
import { useEffect, useState } from "react";
import { BaseItem, CommentItem } from "@/lib/types";
import { fetchComments } from "@/lib/utils";
import StoryUtil from "@/components/StoryUtil";
import Loading from "@/components/Loading";
import Comment from "@/components/Comment/Comment";
import ItemHeader from "@/components/ItemHeader";
import EmptyState from "@/components/EmptyState";
import ChevronDown from "../../public/chevron-down.svg";

// Top-level comments are fetched this many at a time.
const COMMENTS_PER_PAGE = 9;

// A post (story, Ask, Show, poll, job) with its comment tree.
export default function StoryThread({ story }: { story: BaseItem }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const kids = story.kids ?? [];

  useEffect(() => {
    let cancelled = false;
    setComments([]);
    setLoadingComments(true);
    fetchComments(COMMENTS_PER_PAGE, story.kids ?? [], 0)
      .then((first) => {
        if (!cancelled) setComments(first);
      })
      .catch(() => {}) // the "View more comments" button lets them retry
      .finally(() => {
        if (!cancelled) setLoadingComments(false);
      });
    return () => {
      cancelled = true;
    };
  }, [story]);

  async function loadMoreComments() {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const more = await fetchComments(
        COMMENTS_PER_PAGE,
        kids,
        comments.length
      );
      setComments((prev) => [...prev, ...more]);
    } catch {
      // keep what we have; the button stays so they can try again
    } finally {
      setLoadingComments(false);
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <div className="flex flex-col gap-2">
        <ItemHeader by={story.by} time={story.time} />
        <h2 className="font-semibold text-xl sm:text-2xl break-words">
          {story.title}
        </h2>
        {story.text !== undefined ? (
          <div
            className="story-text-expanded | text-sm text-text-secondary"
            dangerouslySetInnerHTML={{ __html: story.text }}
          />
        ) : (
          ""
        )}
        <StoryUtil
          url={story.url}
          score={story.score!}
          descendants={story.descendants!}
        />
      </div>
      <div>
        <button className="rounded-full px-4 py-1 border border-border-secondary text-sm font-medium hover:border-border-button-hover">
          Add Comment
        </button>
      </div>
      {kids.length === 0 ? (
        <EmptyState
          title="Be the first hacker to comment"
          lines={[
            "Nobody's responded to this post yet.",
            "Add your thoughts and get the conversation going.",
          ]}
        />
      ) : (
        <div className="flex flex-col gap-4 ">
          {comments.map((comment) => (
            <Comment
              parentIsComment={false}
              commentItem={comment}
              key={comment.id}
              isLastChildren={false}
              layersDeepFromLoad={0}
            />
          ))}
          {loadingComments ? (
            <Loading />
          ) : kids.length > comments.length ? (
            <div>
              <button
                onClick={loadMoreComments}
                className="flex items-center gap-2 bg-surface-brand rounded-full py-2 px-4"
              >
                <div className="fill-current text-sm w-[1.1rem] group-hover:text-text-primary">
                  <ChevronDown />
                </div>
                <p className="text-sm font-medium">View more comments</p>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}
