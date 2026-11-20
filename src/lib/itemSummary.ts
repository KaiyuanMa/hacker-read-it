import { cache } from "react";
import { BaseItem } from "./types";

// Server-side summary of an item page, used for the <head> tags (link
// previews) and a plain-text <noscript> copy (tools that don't run JS).
// The page itself still renders in the browser exactly as before.

const scheme = process.env.NEXT_PUBLIC_HACKER_NEWS_API_SCHEME;
const host = process.env.NEXT_PUBLIC_HACKER_NEWS_API_HOST;
const version = process.env.NEXT_PUBLIC_HACKER_NEWS_API_VERSION;

// The HTML waits for this, so keep it short. Past it we fall back to the
// site's default tags rather than make the page slow.
const DEADLINE_MS = 1500;
// HN items rarely change after the first hour; a few minutes of cache keeps
// repeat shares and crawlers from hitting the API every time.
const REVALIDATE_SECONDS = 300;
// How far up a reply chain we go looking for the post's title.
const MAX_PARENT_HOPS = 30;
const EXCERPT_LENGTH = 200;

export interface ItemSummary {
  id: number;
  // For a post its title; for a comment "Comment by X on <post title>".
  title: string;
  // A post's "123 points by pg · 45 comments"; empty for a comment, whose
  // title already names the author.
  byline: string;
  // The item's own text as plain-text paragraphs (may be empty).
  paragraphs: string[];
  // A post's external link, if it has one and it's http(s).
  url?: string;
  // For a comment: the post it belongs to, when we found it.
  story?: { id: number; title: string };
}

async function fetchItem(id: number, signal: AbortSignal) {
  const response = await fetch(
    `${scheme}://${host}/${version}/item/${id}.json`,
    { signal, next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!response.ok) throw new Error(`HN API ${response.status}`);
  return (await response.json()) as BaseItem | null;
}

// Wrapped in cache() so generateMetadata and the page share one fetch.
export const getItemSummary = cache(
  async (itemId: string): Promise<ItemSummary | null> => {
    if (!/^\d+$/.test(itemId)) return null;
    const signal = AbortSignal.timeout(DEADLINE_MS);
    try {
      const item = await fetchItem(Number(itemId), signal);
      if (!item || item.deleted || item.dead || !item.by) return null;
      if (item.type === "comment") return await summarizeComment(item, signal);
      if (item.type === "pollopt" || !item.title) return null;
      return summarizePost(item);
    } catch {
      // Timeout, network or API error: the page still works in the browser.
      return null;
    }
  }
);

function summarizePost(item: BaseItem): ItemSummary {
  const parts = [
    item.score !== undefined
      ? `${plural(item.score, "point")} by ${item.by}`
      : `by ${item.by}`,
  ];
  if (item.descendants !== undefined) {
    parts.push(plural(item.descendants, "comment"));
  }
  const url = safeUrl(item.url);
  if (url) parts.push(new URL(url).hostname.replace(/^www\./, ""));

  return {
    id: item.id,
    title: item.title,
    byline: parts.join(" · "),
    paragraphs: htmlToParagraphs(item.text),
    url,
  };
}

async function summarizeComment(
  item: BaseItem,
  signal: AbortSignal
): Promise<ItemSummary> {
  const story = await findStory(item, signal);
  return {
    id: item.id,
    title: `Comment by ${item.by} on ${story ? story.title : "Hacker News"}`,
    byline: "",
    paragraphs: htmlToParagraphs(item.text),
    story,
  };
}

// A comment only knows its parent, so walk up to the post. Any failure here
// just means the title says "on Hacker News" instead of the post's title.
async function findStory(item: BaseItem, signal: AbortSignal) {
  let current = item;
  try {
    for (let hop = 0; hop < MAX_PARENT_HOPS; hop++) {
      if (current.type !== "comment") {
        if (current.deleted || !current.title) return undefined;
        return { id: current.id, title: current.title };
      }
      if (current.parent === undefined) return undefined;
      const parent = await fetchItem(current.parent, signal);
      if (!parent) return undefined;
      current = parent;
    }
  } catch {
    // Out of time or the API failed partway up.
  }
  return undefined;
}

// One line, cut at a word boundary, for meta descriptions.
export function excerpt(paragraphs: string[], max = EXCERPT_LENGTH) {
  const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const words = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${words.trimEnd()}…`;
}

// HN text is a small subset of HTML: <p> between paragraphs, <a>, <i>,
// <pre><code>. Turn it into plain text; React and Next escape it again
// wherever it's rendered, so nothing from HN ends up as markup.
export function htmlToParagraphs(html: string | undefined): string[] {
  if (!html) return [];
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/<p\b[^>]*>/i)
    .map((part) => decodeEntities(part.replace(/<[^>]*>/g, "")).trim())
    .filter(Boolean);
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] !== "#") return NAMED_ENTITIES[code.toLowerCase()] ?? match;
    const hex = code[1] === "x" || code[1] === "X";
    const point = parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
    return point > 0 && point <= 0x10ffff
      ? String.fromCodePoint(point)
      : match;
  });
}

function safeUrl(url: string | undefined) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
