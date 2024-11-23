import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  triggerOnHover?: boolean;
  className?: string;
}

const Popover = ({
  trigger,
  content,
  align = "center",
  side = "bottom",
  className,
}: PopoverProps) => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          side={side}
          sideOffset={5}
          className={cn(
            "bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] p-6 max-w-[400px] z-50",
            className
          )}
        >
          {content}
          <PopoverPrimitive.Arrow className="fill-white" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default Popover;
