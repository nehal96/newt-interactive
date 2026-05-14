interface ArticleDatesProps {
  published: string;
}

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

const ArticleDates = ({ published }: ArticleDatesProps) => (
  <p className="text-sm text-slate-400 font-light text-center mb-12 md:mb-16">
    <time dateTime={published}>{formatDate(published)}</time>
  </p>
);

export default ArticleDates;
