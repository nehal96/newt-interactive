import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function SeriesTitleLink({ href, seriesName }) {
  return (
    href &&
    seriesName && (
      <div className="flex w-full justify-center mx-auto mb-4">
        <Link href={href}>
          <div className="text-indigo-400 hover:text-indigo-500 transition-colors">
            <span className="text-sm md:text-base">{seriesName}</span>
          </div>
        </Link>
      </div>
    )
  );
}

export function NextArticleLink({ href, title }) {
  return (
    <div className="flex justify-end max-w-3xl w-full mx-auto mb-4">
      <Link href={href}>
        <div className="flex flex-col font-medium border-b border-b-transparent hover:border-b-slate-300">
          <span className="text-slate-500 text-sm mb-2">Next</span>
          <div className="inline-flex items-center text-slate-800">
            <span className="text-base md:text-lg mr-1 sm:mr-2">{title}</span>
            <FiChevronRight className="min-w-4 w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PreviousArticleLink({ href, title }) {
  return (
    <div className="flex justify-start max-w-3xl w-full mx-auto mb-4">
      <Link href={href}>
        <div className="flex flex-col font-medium border-b border-b-transparent hover:border-b-slate-300">
          <span className="text-slate-500 text-sm mb-2 ml-5 sm:ml-6">
            Previous
          </span>
          <div className="inline-flex items-center text-slate-800">
            <FiChevronLeft className="min-w-4 h-4" />
            <span className="text-base md:text-lg ml-1 sm:ml-2">{title}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ArticleNavigationContainer({ children }) {
  return (
    <div className="grid grid-flow-col grid-rows-1 auto-cols-auto gap-4 max-w-3xl w-full mx-auto">
      {children}
    </div>
  );
}