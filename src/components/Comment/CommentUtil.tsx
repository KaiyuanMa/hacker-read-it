import React from "react";
import Up from "../../../public/up.svg";
import Comment from "../../../public/comment.svg";

function CommentUtil({ deleted }: { deleted: boolean }) {
  return (
    <>
      {deleted ? (
        <div className="h-6"></div>
      ) : (
        <div className="contents">
          <div />
          <div className="flex items-center gap-6 py-4 ml-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 text-text-secondary fill-current">
                <Up />
              </div>
              <span className="text-xs text-text-secondary font-semibold">
                Up Vote
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-text-secondary fill-current text-sm w-[1.1rem]">
                <Comment />
              </div>
              <span className="text-xs text-text-secondary font-semibold">
                Reply
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentUtil;
