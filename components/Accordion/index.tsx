import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FiInfo, FiChevronDown } from "react-icons/fi";
import { cn } from "../../lib/utils";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  variant?: "prose" | "default";
  className?: string;
  showTitleIcon?: boolean;
}

export default function Accordion({
  title,
  children,
  variant = "default",
  className,
  showTitleIcon = true,
}: AccordionProps) {
  const variants = {
    prose:
      "w-full bg-slate-50 rounded-md max-w-prose self-center px-5 md:px-6 py-4 md:py-5",
    default: "w-full bg-slate-50 rounded-md px-4 py-3",
  };

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn(variants[variant], className)}
    >
      <AccordionPrimitive.Item
        className="text-sm md:text-base font-body"
        value="item-1"
      >
        <AccordionPrimitive.Trigger className="flex items-center text-sm sm:text-base w-full">
          {showTitleIcon && <FiInfo className="mr-1.5" />}
          {title}
          <FiChevronDown className="ml-1" />
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="mt-4 py-3 border-t border-slate-200">
          {children}
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}
