"use client";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  return (
    <div className="flex gap-2 py-2 fixed bg-surface-primary w-full max-w-[1000px] border-b border-border-secondary z-10">
      <button
        className="nav-buttons"
        onClick={() => router.push("/category/top_story")}
      >
        Top
      </button>
      <button
        className="nav-buttons"
        onClick={() => router.push("/category/new_story")}
      >
        New
      </button>
      <button
        className="nav-buttons"
        onClick={() => router.push("/category/best_story")}
      >
        Best
      </button>
      <button
        className="nav-buttons"
        onClick={() => router.push("/category/ask")}
      >
        Ask
      </button>
      <button
        className="nav-buttons"
        onClick={() => router.push("/category/show")}
      >
        Show
      </button>
      <button
        className="nav-buttons"
        onClick={() => router.push("/category/job")}
      >
        Job
      </button>
    </div>
  );
}
