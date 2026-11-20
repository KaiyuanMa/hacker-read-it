import type { Metadata } from "next";
import ItemView from "@/components/ItemView";
import { excerpt, getItemSummary } from "@/lib/itemSummary";
import { itemPath } from "@/lib/utils";

type Props = { params: { itemId: string } };

// The page renders in the browser, but link previews, crawlers and AI tools
// don't run JS. So the server looks the item up once and puts its title and
// an excerpt in <head>, plus a plain-text copy in <noscript>. If the lookup
// fails or is slow, the page gets the site's default tags and works as before.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const summary = await getItemSummary(params.itemId);
  if (!summary) return {};

  const description =
    [summary.byline, excerpt(summary.paragraphs)].filter(Boolean).join(". ") ||
    undefined;
  const path = itemPath(summary.id);

  return {
    title: summary.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: summary.title,
      description,
      url: path,
      type: "article",
      siteName: "Hackers Read It",
    },
    twitter: { card: "summary", title: summary.title, description },
  };
}

export default async function ItemPage({ params }: Props) {
  const summary = await getItemSummary(params.itemId);

  return (
    <>
      {summary ? (
        <noscript>
          <article>
            <h1>{summary.title}</h1>
            {summary.byline ? <p>{summary.byline}</p> : null}
            {summary.url ? (
              <p>
                <a href={summary.url}>{summary.url}</a>
              </p>
            ) : null}
            {summary.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {summary.story ? (
              <p>
                <a href={itemPath(summary.story.id)}>
                  View the full discussion
                </a>
              </p>
            ) : null}
          </article>
        </noscript>
      ) : null}
      <ItemView itemId={params.itemId} />
    </>
  );
}
