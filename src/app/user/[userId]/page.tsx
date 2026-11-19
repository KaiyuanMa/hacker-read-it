"use client";
import { getItem, getUser } from "@/lib/api";
import { BaseItem, UserItem } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading";
import Story from "@/components/Story";
import UserAvatar from "@/components/UserAvatar";
import UserComment from "@/components/UserComment";
import Comments from "../../../../public/comments.svg";
import ChevronDown from "../../../../public/chevron-down.svg";

// `submitted` can hold thousands of ids (newest first), so fetch a page at a time.
const PAGE_SIZE = 30;
// When a filter is on, keep fetching pages until this many new matches show up...
const MIN_NEW_MATCHES = 10;
// ...but never more than this many pages per click.
const MAX_PAGES_PER_LOAD = 5;

type Filter = "all" | "posts" | "comments";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Overview" },
  { value: "posts", label: "Posts" },
  { value: "comments", label: "Comments" },
];

function isVisible(item: BaseItem | null): item is BaseItem {
  // Skip deleted/dead items and poll options (they only make sense inside a poll).
  return (
    item !== null && !item.deleted && !item.dead && item.type !== "pollopt"
  );
}

function matchesFilter(item: BaseItem, filter: Filter) {
  if (filter === "posts") return item.type !== "comment";
  if (filter === "comments") return item.type === "comment";
  return true;
}

async function fetchPage(ids: number[]): Promise<BaseItem[]> {
  const results = await Promise.all(
    ids.map((id) => getItem(id).catch(() => null))
  );
  return results.filter(isVisible);
}

export default function UserPage({ params }: { params: { userId: string } }) {
  const userId = decodeURIComponent(params.userId);

  // undefined = still loading, null = no such user
  const [user, setUser] = useState<UserItem | null | undefined>(undefined);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<BaseItem[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const submitted = useMemo(() => user?.submitted ?? [], [user]);
  const hasMore = nextIndex < submitted.length;
  const visibleItems = items.filter((item) => matchesFilter(item, filter));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setUser(undefined);
      setError(false);
      setItems([]);
      setNextIndex(0);
      try {
        const _user = await getUser(userId);
        if (cancelled) return;
        setUser(_user);
        if (!_user?.submitted?.length) return;

        setLoadingMore(true);
        const firstIds = _user.submitted.slice(0, PAGE_SIZE);
        const firstItems = await fetchPage(firstIds);
        if (cancelled) return;
        setItems(firstItems);
        setNextIndex(firstIds.length);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoadingMore(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function loadMore() {
    setLoadingMore(true);
    let index = nextIndex;
    const newItems: BaseItem[] = [];
    let newMatches = 0;
    let pages = 0;

    while (
      index < submitted.length &&
      pages < MAX_PAGES_PER_LOAD &&
      (pages === 0 || newMatches < MIN_NEW_MATCHES)
    ) {
      const ids = submitted.slice(index, index + PAGE_SIZE);
      const pageItems = await fetchPage(ids);
      newItems.push(...pageItems);
      newMatches += pageItems.filter((item) =>
        matchesFilter(item, filter)
      ).length;
      index += ids.length;
      pages++;
    }

    setItems((prev) => [...prev, ...newItems]);
    setNextIndex(index);
    setLoadingMore(false);
  }

  if (error) {
    return (
      <main className="py-4">
        <EmptyState
          title="Couldn't load this profile"
          lines={[
            "Something went wrong talking to Hacker News.",
            "Try refreshing the page.",
          ]}
        />
      </main>
    );
  }

  if (user === undefined) {
    return (
      <main className="py-4">
        <Loading />
      </main>
    );
  }

  if (user === null) {
    return (
      <main className="py-4">
        <EmptyState
          title={`u/${userId} doesn't exist`}
          lines={["There's no Hacker News user with this name."]}
        />
      </main>
    );
  }

  return (
    <main>
      <div className="flex flex-col w-full gap-4 py-4">
        <div className="flex items-center gap-4">
          <UserAvatar username={user.id} size="lg" />
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-2xl">{user.id}</h2>
            <div className="text-sm text-text-tertiary font-light">
              u/{user.id}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <Stat label="Karma" value={user.karma.toLocaleString("en-US")} />
          <Stat
            label="Joined"
            value={formatDate(user.created)}
            hint={timeAgo(user.created)}
          />
          <Stat
            label="Submissions"
            value={submitted.length.toLocaleString("en-US")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-text-tertiary">About</h3>
          {user.about ? (
            <div
              className="story-text-expanded | text-sm text-text-secondary [&>p:first-child]:mt-0 [&_a]:text-text-brand [&_a]:break-all [&_a:hover]:underline"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(user.about) }}
            />
          ) : (
            <p className="text-sm text-text-tertiary font-light">
              This hacker hasn&apos;t written anything about themselves yet.
            </p>
          )}
        </div>

        <div className="flex gap-2 border-b border-border-primary pb-4">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-1 border text-sm font-medium ${
                filter === f.value
                  ? "bg-surface-secondary border-border-button-hover"
                  : "border-border-secondary hover:border-border-button-hover"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visibleItems.map((item) => (
        <div className="border-b border-border-primary" key={item.id}>
          <div className="hover:bg-background-hover my-1 px-4 rounded-md">
            {item.type === "comment" ? (
              <UserComment comment={item} />
            ) : (
              <Story {...item} />
            )}
          </div>
        </div>
      ))}

      {!loadingMore && visibleItems.length === 0 ? (
        <EmptyState
          title={
            submitted.length === 0
              ? `u/${user.id} hasn't posted anything yet`
              : "Nothing here yet"
          }
          lines={
            hasMore
              ? [
                  "Nothing of this kind in the most recent activity.",
                  "Try loading more below.",
                ]
              : ["No posts or comments to show."]
          }
        />
      ) : (
        ""
      )}

      <div className="py-4">
        {loadingMore ? (
          <Loading />
        ) : hasMore ? (
          <button
            onClick={loadMore}
            className="flex items-center gap-2 bg-surface-brand rounded-full py-2 px-4"
          >
            <div className="fill-current text-sm w-[1.1rem]">
              <ChevronDown />
            </div>
            <p className="text-sm font-medium">Load more</p>
          </button>
        ) : (
          ""
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col" title={hint}>
      <span className="font-semibold">{value}</span>
      <span className="text-xs text-text-tertiary">{label}</span>
    </div>
  );
}

function EmptyState({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="flex gap-5 my-8 items-center">
      <div className="w-16 h-16">
        <Comments />
      </div>
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="text-text-tertiary text-sm mt-4">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
