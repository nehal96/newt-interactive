import { createContext } from "react";

export interface ArticleDatesContextValue {
  published?: string;
  updated?: string;
}

export const ArticleDatesContext = createContext<ArticleDatesContextValue>({});
