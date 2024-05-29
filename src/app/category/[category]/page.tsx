"use client";
import Story from "@/components/story";
import {
  getAsks,
  getBestStories,
  getItem,
  getItems,
  getJobs,
  getNewStories,
  getShows,
  getTopStories,
} from "@/lib/api";
import { BaseItem } from "@/lib/types";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Home({ params }: { params: { category: string } }) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
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
    await fetchMore();
    setItems(items);
    setLoading(false);
  }

  async function fetchMore() {
    if (items.length !== 0 && items.length >= itemIds.length) return;
    const currIndex = items.length;
    const currItems = [];
    for (let i = currIndex; i <= currIndex + 15 && i < itemIds.length; i++) {
      const item = await getItem(itemIds[i]);
      currItems.push(item);
    }
    setItems([...items, ...currItems]);
  }

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          await fetchMore();
          setLoading(false);
        }
        console.log(entries[0]);
      });

      if (node) observer.current.observe(node);
    },
    [loading, fetchMore]
  );

  return (
    <main>
      {items.map((item) => (
        <Story {...item} key={item.id} />
      ))}
      {loading ? (
        <svg
          className="h-7 w-7 text-white animate-spin mx-auto mt-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        ""
      )}
      <div ref={lastElementRef} style={{ height: "5px" }}></div>
    </main>
  );
}
