import { DetailedHTMLProps, TableHTMLAttributes } from "react";

interface PaperMetadataProps
  extends DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  title: string;
  authors: string[];
  datePublished: string;
  paperLink: string;
  blogLink?: string;
}

const PaperMetadata = ({
  title,
  authors,
  datePublished,
  paperLink,
  blogLink,
}: PaperMetadataProps) => {
  return (
    <table className="text-slate-400 max-w-5xl self-center w-full text-xs sm:text-sm">
      <tr className="border-b border-slate-100">
        <th className="text-left pb-2 w-1/6">Title</th>
        <td className="pb-2 w-5/6" colSpan={5}>
          {title}
        </td>
      </tr>
      <tr className="border-b border-slate-100">
        <th className="text-left py-1 pr-2 w-1/6">Authors</th>
        <td className="py-1 w-2/6 border-r" colSpan={2}>
          {authors?.join(", ")}
        </td>
        <th className="text-left py-1 pl-2 w-1/6">Date Published</th>
        <td className="py-1 w-2/6" colSpan={2}>
          {datePublished}
        </td>
      </tr>
      <tr className="border-b border-slate-100">
        <th className="text-left py-1 pr-2 w-1/6">Paper link</th>
        <td className="py-1 w-2/6 border-r" colSpan={2}>
          <a
            href={paperLink}
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-slate-500"
          >
            {paperLink}
          </a>
        </td>
        {blogLink ? (
          <>
            <th className="text-left py-1 pl-2 w-1/6">Blog link</th>
            <td className="py-1 w-2/6" colSpan={2}>
              <a
                href={blogLink}
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-slate-500"
              >
                {blogLink}
              </a>
            </td>
          </>
        ) : null}
      </tr>
    </table>
  );
};

export default PaperMetadata;
