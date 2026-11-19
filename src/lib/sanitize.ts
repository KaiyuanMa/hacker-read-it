// HN's "about" field is HTML written by the user. HN already limits it to a few
// tags, but we still keep only a small allowlist before rendering it, so a
// stray <script>, <img onerror> or javascript: link can never run here.

const ALLOWED_TAGS = new Set([
  "P",
  "A",
  "I",
  "EM",
  "B",
  "STRONG",
  "PRE",
  "CODE",
  "BR",
]);

// Removed together with everything inside them.
const DROPPED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "TEMPLATE",
  "NOSCRIPT",
]);

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cleanNode(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? "")];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const el = node as Element;
  if (DROPPED_TAGS.has(el.tagName)) return [];

  const children = Array.from(el.childNodes).flatMap((child) =>
    cleanNode(child, doc)
  );

  // Unknown tag: keep its text, drop the tag itself.
  if (!ALLOWED_TAGS.has(el.tagName)) return children;

  const clean = doc.createElement(el.tagName.toLowerCase());
  if (el.tagName === "A") {
    const href = el.getAttribute("href") ?? "";
    if (/^https?:\/\//i.test(href)) {
      clean.setAttribute("href", href);
      clean.setAttribute("target", "_blank");
      clean.setAttribute("rel", "nofollow noopener noreferrer");
    }
  }
  children.forEach((child) => clean.appendChild(child));
  return [clean];
}

export function sanitizeHtml(html: string): string {
  // DOMParser only exists in the browser; on the server fall back to plain text.
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return escapeHtml(html);
  }
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const out = document.createElement("div");
  Array.from(parsed.body.childNodes)
    .flatMap((child) => cleanNode(child, document))
    .forEach((child) => out.appendChild(child));
  return out.innerHTML;
}
