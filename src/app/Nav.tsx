export default function Nav() {
  return (
    <div className="flex gap-2 py-2 fixed bg-surface-primary w-full max-w-[1000px] border-b border-border-secondary z-10">
      <a href="/category/top_story">
        <button className="nav-buttons">Top</button>
      </a>
      <a href="/category/new_story">
        <button className="nav-buttons">New</button>
      </a>
      <a href="/category/best_story">
        <button className="nav-buttons">Best</button>
      </a>
      <a href="/category/ask">
        <button className="nav-buttons">Ask</button>
      </a>
      <a href="/category/ask">
        <button className="nav-buttons">Ask</button>
      </a>
      <a href="/category/job">
        <button className="nav-buttons">Job</button>
      </a>
    </div>
  );
}
