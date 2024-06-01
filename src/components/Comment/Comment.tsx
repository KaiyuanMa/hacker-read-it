import { getItem } from "@/lib/api";
import { CommentItem } from "@/lib/types";
import React, { useEffect, useState } from "react";
import ChildrenThreadLine from "./ChildrenThreadLine";
import CommentHeader from "./CommentHeader";
import CommentContent from "./CommentContent";
import CommentUtil from "./CommentUtil";

export default function Comment({
  id,
  isChildren,
  isLastChildren,
}: {
  id: number;
  isChildren: boolean;
  isLastChildren: boolean;
}) {
  const [comment, setComment] = useState<CommentItem>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const _comment = await getItem(id);
    setComment(_comment as CommentItem);
  }

  return (
    <>
      {comment !== undefined ? (
        <>
          <ChildrenThreadLine
            isChildren={isChildren}
            isLastChildren={isLastChildren}
          />
          <div>
            <CommentHeader
              deleted={comment.deleted || false}
              by={comment.by}
              time={comment.time}
            />

            <div className="grid grid-cols-[32px_1fr] relative">
              {/* Main Thread Line */}
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute top-0 left-0 bottom-0 w-8 flex justify-center items-center z-0 cursor-pointer group mb-3"
              >
                {comment.kids !== undefined ? (
                  <div className="w-[1px] h-full group-hover:bg-surface-tertiary bg-surface-secondary" />
                ) : (
                  ""
                )}
              </div>

              <CommentContent text={comment.text} />

              <CommentUtil deleted={comment.deleted || false} />

              <div
                className={`contents w-full ${
                  isHovered
                    ? "[&>.threadline>*]:border-surface-tertiary"
                    : "[&>.threadline>*]:border-primary-primary"
                }`}
              >
                {comment.kids?.map((id, i) => (
                  <Comment
                    id={id}
                    isChildren={true}
                    isLastChildren={comment.kids!.length === i + 1}
                    key={id}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
