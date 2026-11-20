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

export function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function userPath(username: string) {
  return `/user/${encodeURIComponent(username)}`;
}

// Stories and comments share one route; the page picks the view by item type.
export function itemPath(itemId: number) {
  return `/item/${itemId}`;
}

// A comment only knows its direct parent, so to find the story it belongs to
// we walk up the parent chain. Results are cached because comments from the
// same thread share ancestors.
const rootStoryCache = new Map<number, Promise<BaseItem | null>>();

export function findRootStory(
  item: BaseItem,
  depth = 0
): Promise<BaseItem | null> {
  if (item.type !== "comment") return Promise.resolve(item);
  if (item.parent === undefined || depth > 50) return Promise.resolve(null);

  const parentId = item.parent;
  let cached = rootStoryCache.get(parentId);
  if (cached === undefined) {
    cached = getItem(parentId)
      .then((parent) => (parent ? findRootStory(parent, depth + 1) : null))
      .catch(() => {
        rootStoryCache.delete(parentId);
        return null;
      });
    rootStoryCache.set(parentId, cached);
  }
  return cached;
}
