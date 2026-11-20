import { formatDate, timeAgo } from "@/lib/utils";
import React from "react";
import UserName from "./UserName";

// Author and age of a story or comment. Pass `href` to make the age a link,
// the way HN links a comment's age to the comment's own page.
function ItemHeader({
  by,
  time,
  href,
}: {
  by: string;
  time: number;
  href?: string;
}) {
  return (
    <div className="flex items-center h-full gap-2 text-text-tertiary text-sm">
      <UserName username={by} />
      {href ? (
        <a
          href={href}
          title={formatDate(time)}
          className="font-light relative hover:underline"
        >
          {timeAgo(time)}
        </a>
      ) : (
        <div className="font-light">{timeAgo(time)}</div>
      )}
    </div>
  );
}

export default ItemHeader;
