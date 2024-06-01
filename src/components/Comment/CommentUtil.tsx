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
            <button className="flex gap-2 items-center group">
              <div className="w-4 text-text-secondary fill-current group-hover:text-text-primary">
                <Up />
              </div>
              <span className="text-xs text-text-secondary font-semibold group-hover:text-text-primary">
                Up Vote
              </span>
            </button>
            <button className="flex gap-2 items-center hover:text-text-primary group">
              <div className="text-text-secondary fill-current text-sm w-[1.1rem] group-hover:text-text-primary">
                <Comment />
              </div>
              <span className="text-xs text-text-secondary font-semibold group-hover:text-text-primary">
                Reply
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentUtil;
