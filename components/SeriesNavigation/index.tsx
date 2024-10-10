import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function NextArticleLink({ href, title }) {
  return (
    <div className="flex justify-end max-w-3xl w-full mx-auto mt-10 mb-4">
      <Link href={href}>
        <div className="flex flex-col text-lg font-medium border-b border-b-transparent hover:border-b-slate-300">
          <span className="text-slate-500 text-sm mb-2">Next</span>
          <div className="inline-flex items-center text-slate-800">
            <span>{title}</span>
            <FiChevronRight className="ml-2" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PreviousArticleLink({ href, title }) {
  return (
    <div className="flex justify-start max-w-3xl w-full mx-auto mt-10 mb-4">
      <Link href={href}>
        <div className="flex flex-col text-lg font-medium border-b border-b-transparent hover:border-b-slate-300">
          <span className="text-slate-500 text-sm mb-2 ml-7">Previous</span>
          <div className="inline-flex items-center text-slate-800">
            <FiChevronLeft className="mr-2" />
            <span>{title}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
