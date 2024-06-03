export default function Nav() {
  return (
    <div className="flex gap-2 py-2 fixed bg-surface-primary border-b border-border-secondary z-50 max-w-[960px] w-full">
      <a href="/category/top_story">
        <button className="nav-buttons">Top</button>
      </a>
      <a href="/category/new_story">
        <button className="nav-buttons">New</button>
      </a>
      <a href="/category/best_story">
        <button className="nav-buttons">Best</button>
      </a>
      <a href="/category/show">
        <button className="nav-buttons">Show</button>
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
