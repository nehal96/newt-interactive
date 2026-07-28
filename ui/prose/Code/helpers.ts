export type CodeVariant = "light" | "medium" | "dark";

export const getStyles = (variant: CodeVariant) => {
  switch (variant) {
    case "medium":
      return "bg-ink-200 text-ink-800";
    case "dark":
      return "bg-ink-700 text-ink-100";
    default:
      return "";
  }
};
