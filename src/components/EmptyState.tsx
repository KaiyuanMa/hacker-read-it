import Comments from "../../public/comments.svg";

// The big icon + message used when a page has nothing to show.
export default function EmptyState({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex gap-5 my-8 items-center">
      <div className="w-16 h-16 shrink-0">
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
