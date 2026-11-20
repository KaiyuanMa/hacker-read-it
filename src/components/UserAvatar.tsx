import { userPath } from "@/lib/utils";

// The square "first letter" avatar used next to comments.
// Pass `link` to make it open the user's profile page.
export default function UserAvatar({
  username,
  size = "sm",
  link = false,
}: {
  username: string;
  size?: "sm" | "lg";
  link?: boolean;
}) {
  // The small one shrinks a little on phones so nested comments keep more room.
  const sizeClass =
    size === "lg"
      ? "w-16 h-16 text-2xl"
      : "w-6 h-6 text-xs sm:w-8 sm:h-8 sm:text-sm";
  const avatar = (
    <div
      className={`bg-surface-secondary ${sizeClass} text-text-primary flex justify-center items-center font-semibold`}
    >
      {username ? username[0].toUpperCase() : ""}
    </div>
  );

  if (!link || !username) return avatar;

  return (
    <a
      href={userPath(username)}
      title={`View ${username}'s profile`}
      className="block w-fit hover:opacity-80"
    >
      {avatar}
    </a>
  );
}
