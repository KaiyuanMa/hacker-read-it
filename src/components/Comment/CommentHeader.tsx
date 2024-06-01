import React from "react";
import ItemHeader from "../ItemHeader";

export default function CommentHeader({
  deleted,
  by,
  time,
}: {
  deleted: boolean;
  by: string;
  time: number;
}) {
  return (
    <div className="grid grid-cols-[32px_minmax(0,1fr)]">
      <div className="bg-surface-secondary w-8 h-8 text-text-primary flex justify-center items-center text-sm font-semibold">
        {!deleted ? by[0].toUpperCase() : ""}
      </div>
      <div className="ml-2">
        <ItemHeader by={!deleted ? by : "[deleted]"} time={time} />
      </div>
    </div>
  );
}
