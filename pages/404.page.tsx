import Link from "next/link";
import { SeoHead } from "@ui/article";
import { PageShell } from "@ui/layout";

const metadata = {
  title: "Page not found",
  description: "That page doesn't exist.",
  url: "https://www.newtinteractive.com/404",
  ogType: "website" as const,
};

export default function NotFound() {
  return (
    <>
      <SeoHead metadata={metadata} />
      <PageShell>
        <div className="mx-auto w-full max-w-column px-5 py-24 sm:py-32">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-400">
            404
          </p>
          <h1 className="mt-3 font-title text-3xl leading-tight text-ink-900 sm:text-[2.125rem]">
            Page not found
          </h1>
          <p className="mt-3 max-w-[34rem] font-ui text-[1.0625rem] leading-relaxed text-ink-500">
            That page doesn&rsquo;t exist &mdash; it may have moved or never
            been here at all.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block font-ui text-[0.9375rem] text-ink-800 underline decoration-ink-300 underline-offset-2 transition-colors hover:text-ink-900 hover:decoration-ink-500"
          >
            Back to everything
          </Link>
        </div>
      </PageShell>
    </>
  );
}
