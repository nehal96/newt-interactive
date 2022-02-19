import { DetailedHTMLProps, TableHTMLAttributes } from "react";
import { useScreenBreakpoint } from "../../hooks";

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
  const isMd = useScreenBreakpoint("md");

  return (
    <table className="text-slate-400 max-w-5xl self-center text-xs md:text-sm table-fixed w-full">
      <tbody>
        <tr className="border-b border-slate-100">
          <th className="text-left pb-2 pr-2">Title</th>
          <td className={`pb-2 ${!isMd ? "pl-2" : ""}`} colSpan={5}>
            {title}
          </td>
        </tr>
        {isMd ? (
          <>
            <tr className="border-b border-slate-100">
              <th className="text-left py-1 pr-2">Authors</th>
              <td className="py-1 pr-2 border-r" colSpan={2}>
                {authors?.join(", ")}
              </td>
              <th className="text-left py-1 px-2">Date Published</th>
              <td className="py-1" colSpan={2}>
                {datePublished}
              </td>
            </tr>
          </>
        ) : (
          <>
            <tr className="border-b border-slate-100">
              <th className="text-left py-1 pr-2">Authors</th>
              <td className="py-1 pl-2" colSpan={5}>
                {authors?.join(", ")}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <th className="text-left py-1 pr-2">Date Published</th>
              <td className="py-1 pl-2" colSpan={5}>
                {datePublished}
              </td>
            </tr>
          </>
        )}
        {isMd ? (
          <>
            <tr className="border-b border-slate-100">
              <th className="text-left py-1 pr-2">Paper link</th>
              <td
                className="py-1 pr-2 border-r truncate md:whitespace-normal"
                colSpan={2}
              >
                <a
                  href={paperLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-slate-500 text-ellipsis"
                >
                  {paperLink}
                </a>
              </td>
              {blogLink ? (
                <>
                  <th className="text-left py-1 px-2">Blog link</th>
                  <td
                    className="py-1 truncate md:whitespace-normal"
                    colSpan={2}
                  >
                    <a
                      href={blogLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline hover:text-slate-500 text-ellipsis"
                    >
                      {blogLink}
                    </a>
                  </td>
                </>
              ) : null}
            </tr>
          </>
        ) : (
          <>
            <tr className="border-b border-slate-100">
              <th className="text-left py-1 pr-2">Paper link</th>
              <td
                className="py-1 pl-2 truncate md:whitespace-normal"
                colSpan={5}
              >
                <a
                  href={paperLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-slate-500 text-ellipsis"
                >
                  {paperLink}
                </a>
              </td>
            </tr>
            {blogLink ? (
              <tr>
                <th className="text-left py-1 pr-2">Blog link</th>
                <td
                  className="py-1 pl-2 truncate md:whitespace-normal"
                  colSpan={5}
                >
                  <a
                    href={blogLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline hover:text-slate-500 text-ellipsis"
                  >
                    {blogLink}
                  </a>
                </td>
              </tr>
            ) : null}
          </>
        )}
      </tbody>
    </table>
  );
};

export default PaperMetadata;
