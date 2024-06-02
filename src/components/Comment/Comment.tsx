import { CommentItem } from "@/lib/types";
import React, { useEffect, useState } from "react";
import ChildrenThreadLine from "./ChildrenThreadLine";
import CommentHeader from "./CommentHeader";
import CommentContent from "./CommentContent";
import CommentUtil from "./CommentUtil";
import Loading from "../Loading";
import { fetchComments } from "@/lib/utils";
import CirclePlus from "../../../public/circle-plus.svg";

export default function Comment({
  commentItem,
  parentIsComment,
  isLastChildren,
  layersDeepFromLoad,
}: {
  commentItem: CommentItem;
  isLastChildren: boolean;
  parentIsComment: boolean;
  layersDeepFromLoad: number;
}) {
  const [childrenComments, setChildrenComments] = useState<CommentItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);

  useEffect(() => {
    const fetchCount = computeFetchCount();
    fetchData(fetchCount);
  }, []);

  async function fetchData(fetchCount: number) {
    if (commentItem.kids !== undefined && commentItem.kids.length > 0) {
      const _childrenComment = await fetchComments(
        fetchCount,
        commentItem.kids,
        childrenComments.length
      );
      setChildrenComments([...childrenComments, ..._childrenComment]);
    }
  }

  function computeFetchCount() {
    if (commentItem.kids !== undefined && commentItem.kids.length > 0) {
      if (commentItem.kids.length > 2) return 2;
      return commentItem.kids.length;
    }
    return 0;
  }

  async function loadMoreComment() {
    setIsLoadingMoreComments((pre) => !pre);
    await fetchData(commentItem.kids!.length);
    setIsLoadingMoreComments((pre) => !pre);
  }

  return (
    <>
      {commentItem !== undefined ? (
        <>
          <ChildrenThreadLine
            parentIsComment={parentIsComment}
            isLastChildren={isLastChildren}
          />
          <div>
            <CommentHeader
              deleted={commentItem.deleted || false}
              by={commentItem.by}
              time={commentItem.time}
            />
            <div className="grid grid-cols-[32px_1fr] relative">
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute top-0 left-0 bottom-0 w-8 flex justify-center items-center z-0 cursor-pointer group mb-3"
              >
                {commentItem.kids !== undefined ? (
                  <div className="w-[1px] h-full group-hover:bg-surface-tertiary bg-surface-secondary" />
                ) : (
                  ""
                )}
              </div>

              <CommentContent text={commentItem.text} />

              <CommentUtil deleted={commentItem.deleted || false} />

              <div
                className={`contents w-full ${
                  isHovered
                    ? "[&>.threadline>*]:border-surface-tertiary"
                    : "[&>.threadline>*]:border-border-primary"
                }`}
              >
                {childrenComments.map((comment, i) => (
                  <Comment
                    commentItem={comment}
                    parentIsComment={true}
                    isLastChildren={commentItem.kids!.length === i + 1}
                    key={comment.id}
                  />
                ))}
              </div>
              {commentItem.kids !== undefined &&
              childrenComments.length < commentItem.kids.length ? (
                <button className="group contents" onClick={loadMoreComment}>
                  <div className="threadline flex justify-end align-start relative pointer-events-none bg-surface-primary">
                    <div
                      className={`box-border h-4 border-1 border-solid border-b-[1px] w-[calc(50%+0.5px)] rounded-bl-[12px] border-l-[1px] ${
                        isHovered
                          ? "border-surface-tertiary"
                          : "border-border-primary"
                      }`}
                    />
                  </div>
                  {isLoadingMoreComments ? (
                    <div className="flex items-start">
                      <Loading />
                    </div>
                  ) : (
                    <div className="flex items-center h-8 gap-2">
                      <div className="text-text-primary fill-current text-sm w-[1.1rem] group-hover:text-text-primary">
                        <CirclePlus />
                      </div>
                      <p className="font-light text-text-tertiary text-sm group-hover:underline">
                        {commentItem.kids.length - childrenComments.length} more
                        comments
                      </p>
                    </div>
                  )}
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
