import React from "react";

function CommentContent({ text }: { text: string }) {
  return (
    <div className="contents">
      <div />
      <div
        className="story-text-expanded | block text-sm text-text-primary font-light ml-2"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

export default CommentContent;
