import type { MetadataRoute } from "next";

// Lets the site be added to a phone's home screen and open full screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hackers Read It",
    short_name: "Read It",
    description: "A Reddit-style Hacker News reader",
    start_url: "/category/top_story",
    display: "standalone",
    background_color: "#0d1114",
    theme_color: "#0d1114",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
