"use client";
import { getItem } from "@/lib/api";
import { BaseItem } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import StoryUtil from "@/components/StoryUtil";
import Loading from "@/components/Loading";
import Comment from "@/components/Comment";

export default function Item({ params }: { params: { itemId: string } }) {
  const [item, setItem] = useState<BaseItem>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const _item = await getItem(params.itemId);
    setItem(_item);
    setLoading(false);
  }
  return (
    <main>
      {loading ? (
        <Loading />
      ) : item !== undefined ? (
        <div className="flex flex-col w-full gap-2 py-4">
          <div className="flex items-center gap-2 text-text-tertiary text-sm">
            <div className="font-semibold">{item.by}</div>
            <div className="font-light">{timeAgo(item.time)}</div>
          </div>
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
          <div>
            <button className="rounded-full px-4 py-2 border border-border-secondary">
              Add Comment
            </button>
          </div>
          <div>
            <div>Sort by:</div>
            <div className="flex flex-col gap-4">
              {item.kids?.map((id) => (
                <Comment
                  id={id}
                  key={id}
                  isChildren={false}
                  isLastChildren={false}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
