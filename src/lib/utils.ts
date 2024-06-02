import { getItem } from "./api";
import { BaseItem, CommentItem } from "./types";

export function timeAgo(timestamp: number) {
  const now = Date.now() / 1000;
  const secondsAgo = now - timestamp;

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hr.", seconds: 3600 },
    { name: "min.", seconds: 60 },
    { name: "sec.", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name} ago`;
    }
  }
  return "just now";
}

export async function fetchComments(
  fetchCount: number,
  kids: number[],
  currIndex: number
): Promise<CommentItem[]> {
  if (kids.length === 0) return [];
  const promises = [];
  for (
    let i = currIndex;
    i <= currIndex + fetchCount - 1 && i < kids.length;
    i++
  ) {
    promises.push(getItem(kids[i]));
  }

  const comments = await Promise.all(promises);
  return comments as CommentItem[];
}
