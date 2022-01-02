export type CodeVariant = "light" | "medium" | "dark";

export const getStyles = (variant: CodeVariant) => {
  switch (variant) {
    case "medium":
      return "bg-slate-200 text-slate-800";
    case "dark":
      return "bg-slate-700 text-slate-50";
    default:
      return "";
  }
};
