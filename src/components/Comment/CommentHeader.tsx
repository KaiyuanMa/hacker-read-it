import React from "react";
import ItemHeader from "../ItemHeader";
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
    <div className="grid grid-cols-[32px_minmax(0,1fr)]">
      {isCollapsed ? (
        <div className="flex w-8 h-8 items-center justify-center py-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-text-primary fill-current text-sm w-[1.1rem] group-hover:text-text-primary bg-surface-primary z-10"
          >
            <CirclePlus />
          </button>
        </div>
      ) : (
        <div className="bg-surface-secondary w-8 h-8 text-text-primary flex justify-center items-center text-sm font-semibold">
          {!deleted ? by[0].toUpperCase() : ""}
        </div>
      )}

      <div className="ml-2">
        <ItemHeader by={!deleted ? by : "[deleted]"} time={time} />
      </div>
    </div>
  );
}
