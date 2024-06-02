"use client";
import { getItem } from "@/lib/api";
import { BaseItem, CommentItem } from "@/lib/types";
import { fetchComments } from "@/lib/utils";
import { useEffect, useState } from "react";
import StoryUtil from "@/components/StoryUtil";
import Loading from "@/components/Loading";
import Comment from "@/components/Comment/Comment";
import Comments from "../../../../public/comments.svg";
import ItemHeader from "@/components/ItemHeader";

export default function Item({ params }: { params: { itemId: string } }) {
  const [item, setItem] = useState<BaseItem>();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentItem[]>([]);

  useEffect(() => {
    fetchData();

    async function fetchData() {
      setLoading(true);
      const _item = await getItem(params.itemId);
      setItem(_item);
      if (_item.kids !== undefined) {
        const _comments = await fetchComments(9, _item.kids, comments.length);
        setComments([...comments, ..._comments]);
      }

      setLoading(false);
    }
  }, [comments, params.itemId]);

  return (
    <main>
      {loading ? (
        <Loading />
      ) : item !== undefined ? (
        <div className="flex flex-col w-full gap-4 py-4">
          <div className="flex flex-col gap-2">
            <ItemHeader by={item.by} time={item.time} />
            <h2 className="font-semibold text-2xl">{item.title}</h2>
            {item.text !== undefined ? (
              <div
                className="story-text-expanded | text-sm text-text-secondary"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            ) : (
              ""
            )}
            <StoryUtil
              url={item.url}
              score={item.score!}
              descendants={item.descendants!}
            />
          </div>
          <div>
            <button className="rounded-full px-4 py-1 border border-border-secondary text-sm font-medium hover:border-border-button-hover">
              Add Comment
            </button>
          </div>
          {/* <div className="text-sm text-text-tertiary">
            <div>Sort by:</div>
          </div> */}
          {item.kids === undefined || item.kids.length === 0 ? (
            <div className="flex gap-5 my-8 items-center">
              <div className="w-16 h-16">
                <Comments />
              </div>
              <div>
                <h2 className="text-lg font-medium">
                  Be the first hacker to comment
                </h2>
                <div className="text-text-tertiary text-sm mt-4">
                  <p>Nobody&apos;s responded to this post yet.</p>
                  <p>Add your thoughts and get the conversation going.</p>
                </div>
              </div>
            </div>
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
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
