const LINKS = [
  { label: "Twitter", href: "https://www.twitter.com/nehaludyavar" },
  {
    label: "Email",
    href: `mailto:nehaludyavar@gmail.com?subject=${encodeURIComponent("Hello")}`,
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/70">
      <div className="mx-auto flex w-full max-w-column flex-col gap-3 px-5 py-10 font-ui text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-400">
          Newt Interactive — made by Nehal Udyavar
        </p>
        <div className="flex gap-5">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-slate-500 transition-colors hover:text-slate-900"
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
