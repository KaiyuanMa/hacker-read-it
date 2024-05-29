export function timeAgo(timestamp: number) {
  const now = Date.now() / 1000;
  const secondsAgo = now - timestamp;

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hr.", seconds: 3600 },
    { name: "min.", seconds: 60 },
    { name: "sec.", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name} ago`;
    }
  }
  return "just now";
}
