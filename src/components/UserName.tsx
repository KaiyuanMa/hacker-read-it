import { userPath } from "@/lib/utils";

// A username that links to the user's profile page.
// `relative` keeps it clickable above the full-card links in Story.
export default function UserName({ username }: { username: string }) {
  if (!username || username === "[deleted]") {
    return <div className="font-semibold">{username}</div>;
  }
  return (
    <a
      href={userPath(username)}
      className="font-semibold relative hover:underline"
    >
      {username}
    </a>
  );
}
