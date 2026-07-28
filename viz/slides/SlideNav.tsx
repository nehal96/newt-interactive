import { Select } from "radix-ui";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { Button } from "@ui/controls";
import { cn } from "@lib/utils";

export type SlideSection = { value: string; label: string };

interface SlideNavProps {
  slideNumber: number;
  totalSlides: number;
  onReset: () => void;
  sections?: SlideSection[];
  currentSection?: string;
  onJumpToSection?: (value: string) => void;
}

const SlideNav = ({
  slideNumber,
  totalSlides,
  onReset,
  sections,
  currentSection,
  onJumpToSection,
}: SlideNavProps) => {
  const label = sections?.find((s) => s.value === currentSection)?.label;

  return (
    <div
      className={cn(
        "flex items-center text-slate-400 mb-6",
        sections?.length ? "justify-between" : "justify-end"
      )}
    >
      {sections?.length ? (
        <div>
          <Select.Root value={currentSection} onValueChange={onJumpToSection}>
            <Select.Trigger className="inline-flex items-center justify-center leading-none data-[placeholder]:text-slate-600 outline-none text-sm hover:text-slate-600">
              <Select.Value aria-label={label}>{label}</Select.Value>
              <Select.Icon>
                <FiChevronDown className="ml-1" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={6}
                className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
              >
                <Select.Viewport className="p-[5px]">
                  {sections.map((section) => (
                    <Select.Item
                      className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                      value={section.value}
                      key={section.value}
                    >
                      <Select.ItemText>{section.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                        <FiCheck />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      ) : null}
      <div>
        <Button
          variant="outline"
          className="mr-2 text-xs hover:text-slate-500 md:mr-4 md:text-sm"
          onClick={onReset}
        >
          Reset
        </Button>
        <span className="text-xs md:text-sm">{`${slideNumber} / ${totalSlides}`}</span>
      </div>
    </div>
  );
};

export default SlideNav;
