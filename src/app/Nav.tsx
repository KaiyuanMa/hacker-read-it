import BackButton from "@/components/BackButton";

// Sticky instead of fixed so it always matches the page width. On phones the
// buttons get smaller, and the row scrolls sideways if it still doesn't fit.
export default function Nav() {
  return (
    <nav className="no-scrollbar flex gap-1.5 sm:gap-2 py-2 sticky top-0 overflow-x-auto bg-surface-primary border-b border-border-secondary z-50 w-full">
      <BackButton />
      <a className="shrink-0" href="/category/top_story">
        <button className="nav-buttons">Top</button>
      </a>
      <a className="shrink-0" href="/category/new_story">
        <button className="nav-buttons">New</button>
      </a>
      <a className="shrink-0" href="/category/best_story">
        <button className="nav-buttons">Best</button>
      </a>
      <a className="shrink-0" href="/category/show">
        <button className="nav-buttons">Show</button>
      </a>
      <a className="shrink-0" href="/category/ask">
        <button className="nav-buttons">Ask</button>
      </a>
      <a className="shrink-0" href="/category/job">
        <button className="nav-buttons">Job</button>
      </a>
    </nav>
  );
}
