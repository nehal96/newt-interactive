const LINKS = [
  { label: "Twitter", href: "https://www.twitter.com/nehaludyavar" },
  {
    label: "Email",
    href: `mailto:nehaludyavar@gmail.com?subject=${encodeURIComponent("Hello")}`,
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-ink-200/70">
      {/* Asymmetric padding: the rule above already opens the gap, so a matching
          pt-10 read as a hole between the page and its colophon. */}
      <div className="mx-auto flex w-full max-w-column flex-col gap-3 px-5 pb-10 pt-5 font-ui text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-400">
          Newt Interactive — made by Nehal Udyavar
        </p>
        <div className="flex gap-5">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink-500 transition-colors hover:text-ink-900"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
