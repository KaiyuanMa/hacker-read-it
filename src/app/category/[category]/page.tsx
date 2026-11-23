"use client";
import Story from "@/components/Story";
import {
  getAsks,
  getBestStories,
  getItem,
  getJobs,
  getNewStories,
  getShows,
  getTopStories,
} from "@/lib/api";
import { BaseItem } from "@/lib/types";
import { useEffect, useState, useRef, useCallback } from "react";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function Category({ params }: { params: { category: string } }) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  // Set when the list itself couldn't load (e.g. offline, never opened before).
  const [error, setError] = useState(false);
  // Set when loading more failed, so scrolling stops retrying until the
  // connection comes back.
  const [stalled, setStalled] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchData().catch(() => {
      setError(true);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const resume = () => setStalled(false);
    window.addEventListener("online", resume);
    return () => window.removeEventListener("online", resume);
  }, []);

  async function fetchMore(fetchCount: number) {
    if (items.length !== 0 && items.length >= itemIds.length) return;
    const currIndex = items.length;
    const promises = [];
    for (
      let i = currIndex;
      i <= currIndex + fetchCount && i < itemIds.length;
      i++
    ) {
      promises.push(getItem(itemIds[i]));
    }
    const results = await Promise.all(promises);

    setItems([...items, ...results]);
  }

  async function fetchData() {
    let itemIds: number[] = [];
    switch (params.category) {
      case "top_story":
        itemIds = await getTopStories();
        break;
      case "best_story":
        itemIds = await getBestStories();
        break;
      case "new_story":
        itemIds = await getNewStories();
        break;
      case "ask":
        itemIds = await getAsks();
        break;
      case "show":
        itemIds = await getShows();
        break;
      case "job":
        itemIds = await getJobs();
        break;
    }
    setItemIds(itemIds);
    await fetchMore(9);
    setItems(items);
    setLoading(false);
  }

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (loading || stalled) return;

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          try {
            await fetchMore(9);
          } catch {
            // Offline and these stories were never opened: keep what's
            // shown instead of spinning forever.
            setStalled(true);
          } finally {
            setLoading(false);
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, stalled, fetchMore]
  );

  if (error) {
    return (
      <EmptyState
        title="Couldn't load this page"
        lines={[
          "Something went wrong talking to Hacker News.",
          "Try refreshing the page.",
        ]}
      />
    );
  }

  return (
    <main>
      {items.map((item) => (
        <div className="border-b border-border-primary" key={item.id}>
          <div className="hover:bg-background-hover my-1 px-4 rounded-md">
            <Story {...item} />
          </div>
        </div>
      ))}
      {loading ? <Loading /> : ""}
      <div ref={lastElementRef} style={{ height: "5px" }}></div>
    </main>
  );
}
