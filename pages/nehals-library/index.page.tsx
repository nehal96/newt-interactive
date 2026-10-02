import { useMemo, useState } from "react";
import { SeoHead } from "@ui/article";
import { PageShell } from "@ui/layout";
import { SITE_URL } from "@lib/links";
import { cn } from "@lib/utils";
import type { GetStaticProps } from "next";
import { allBooks } from "@lib/library/db";
import { type Book, type Kind, authorKey, titleKey, toBook } from "./books";
import { Grid, List } from "./views";

const metadata = {
  title: "Nehal’s Library",
  description: "Every book on my shelves.",
  url: `${SITE_URL}/nehals-library`,
  ogImage: `${SITE_URL}/logo-banner.png`,
  ogType: "website" as const,
};

const VIEWS = ["grid", "list"] as const;
const SHOWS = ["all", "fiction", "nonfiction", "magazines"] as const;
const SORTS = ["title", "author", "year"] as const;

const SHOW_KIND: Record<(typeof SHOWS)[number], Kind | null> = {
  all: null,
  fiction: "fiction",
  nonfiction: "nonfiction",
  magazines: "magazine",
};

const SORTERS: Record<(typeof SORTS)[number], (a: Book, b: Book) => number> = {
  title: (a, b) => titleKey(a).localeCompare(titleKey(b)),
  author: (a, b) => authorKey(a).localeCompare(authorKey(b)) || (a.year ?? 0) - (b.year ?? 0),
  year: (a, b) => (a.year ?? 9999) - (b.year ?? 9999),
};

function Pills<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors",
            o === value ? "bg-ink-900 text-paper" : "text-ink-500 hover:bg-ink-100 hover:text-ink-900",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

type Props = { books: Book[] };

// Regenerated on demand by the library connector; the hourly revalidate only backstops a missed call.
export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { books: (await allBooks()).map(toBook) },
  revalidate: 3600,
});

export default function NehalsLibrary({ books: all }: Props) {
  const [view, setView] = useState<(typeof VIEWS)[number]>("grid");
  const [show, setShow] = useState<(typeof SHOWS)[number]>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("title");
  const [query, setQuery] = useState("");

  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    const kind = SHOW_KIND[show];
    return all.filter((b) => (!kind || b.kind === kind) && (!q || `${b.title} ${b.byline} ${b.publisher}`.toLowerCase().includes(q))).sort(
      SORTERS[sort],
    );
  }, [all, show, sort, query]);

  const count = (k: Kind) => all.filter((b) => b.kind === k).length;

  return (
    <>
      <SeoHead metadata={metadata} />
      <PageShell>
        <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-8 sm:pt-12">
          <h1 className="font-title text-4xl text-ink-900 sm:text-5xl">{metadata.title}</h1>
          <p className="mt-3 flex flex-wrap gap-x-4 font-ui text-ink-500">
            <span>{count("fiction")} fiction</span>
            <span>{count("nonfiction")} nonfiction</span>
            <span>{count("magazine")} magazines</span>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-ink-200 py-3">
            <Pills<(typeof VIEWS)[number]> label="View" options={VIEWS} value={view} onChange={setView} />
            <Pills<(typeof SHOWS)[number]> label="Show" options={SHOWS} value={show} onChange={setShow} />
            <Pills<(typeof SORTS)[number]> label="Sort" options={SORTS} value={sort} onChange={setSort} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search the library"
              className="ml-auto w-full rounded-full border border-ink-200 bg-transparent px-3 py-1 font-ui text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-500 focus:outline-none sm:w-48"
            />
          </div>

          <div className="mt-10">
            {books.length === 0 ? (
              <p className="font-ui text-ink-400">Nothing matches.</p>
            ) : view === "grid" ? (
              <Grid books={books} />
            ) : (
              <List books={books} />
            )}
          </div>
        </div>
      </PageShell>
    </>
  );
}
