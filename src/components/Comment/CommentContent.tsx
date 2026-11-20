import React from "react";

// HN still serves dead (flagged or killed) comments, text included. Like HN
// with "showdead" off, we show a placeholder instead of their text.
function CommentContent({ text, dead }: { text?: string; dead?: boolean }) {
  return (
    <div className="contents">
      <div />
      {dead ? (
        <p className="block text-sm text-text-tertiary font-light italic ml-2">
          [dead]
        </p>
      ) : (
        <div
          className="story-text-expanded | block text-sm text-text-primary font-light ml-2"
          dangerouslySetInnerHTML={{ __html: text ?? "" }}
        />
      )}
    </div>
  );
}

export default CommentContent;
