import { timeAgo } from "@/lib/utils";
import React from "react";

function ItemHeader({ by, time }: { by: string; time: number }) {
  return (
    <div className="flex items-center h-full gap-2 text-text-tertiary text-sm">
      <div className="font-semibold">{by}</div>
      <div className="font-light">{timeAgo(time)}</div>
    </div>
  );
}

export default ItemHeader;
