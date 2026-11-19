import React from "react";
import ItemHeader from "../ItemHeader";
import UserAvatar from "../UserAvatar";
import CirclePlus from "../../../public/circle-plus.svg";

export default function CommentHeader({
  deleted,
  by,
  time,
  isCollapsed,
  setIsCollapsed,
}: {
  deleted: boolean;
  by: string;
  time: number;
  isCollapsed: boolean;
  setIsCollapsed: Function;
}) {
  return (
    <div className="grid grid-cols-[24px_minmax(0,1fr)] sm:grid-cols-[32px_minmax(0,1fr)]">
      {isCollapsed ? (
        <div className="flex w-6 h-6 sm:w-8 sm:h-8 items-center justify-center py-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="tap-target text-text-primary fill-current text-sm w-[1.1rem] group-hover:text-text-primary bg-surface-primary z-10"
          >
            <CirclePlus />
          </button>
        </div>
      ) : (
        <UserAvatar username={!deleted ? by : ""} link={!deleted} />
      )}

      <div className="ml-2">
        <ItemHeader by={!deleted ? by : "[deleted]"} time={time} />
      </div>
    </div>
  );
}
