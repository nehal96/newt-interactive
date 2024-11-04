import Link from "next/link";
import Image from "next/legacy/image";
import { cn } from "../../lib/utils";

interface TopicCardProps {
  href: string;
  imageSrc: string;
  title: string;
  darkText?: boolean;
  className?: string;
  withTitleBlur?: boolean;
}

interface TopicHeaderProps {
  children: React.ReactNode;
}

interface EdgelessScrollContainerProps {
  children: React.ReactNode;
}

interface TopicCardContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({ children }) => {
  return (
    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-4 sm:mb-6">
      {children}
    </h1>
  );
};

export const TopicCard: React.FC<TopicCardProps> = ({
  href,
  imageSrc,
  title,
  darkText = false,
  className = "",
  withTitleBlur = false,
}) => {
  const textColor = darkText ? "text-slate-800" : "text-white";

  return (
    <Link
      href={href}
      className={cn("mr-4 snap-start flex-shrink-0", className)}
    >
      <div className="relative aspect-[3/4] h-[300px] lg:h-[350px] overflow-hidden rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group">
        <Image
          src={imageSrc}
          layout="fill"
          className="transition-transform duration-300 ease-in-out group-hover:scale-105 object-cover"
          alt={title}
        />
        {withTitleBlur && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        )}
        <div>
          <h3
            className={`absolute bottom-4 left-4 text-lg font-semibold ${textColor}`}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export const EdgelessScrollContainer: React.FC<
  EdgelessScrollContainerProps
> = ({ children }) => {
  return (
    <div className="w-full max-container">
      <div
        className="flex w-[var(--document-width)]"
        style={{
          marginLeft: "calc(-1 * var(--gutter-size)",
        }}
      >
        <div className="flex scroll-px-[var(--gutter-size)] min-w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar relative">
          <div className="shrink-0 w-[var(--gutter-size)]"></div>
          {children}
          <div className="shrink-0 w-[var(--gutter-size)]"></div>
        </div>
      </div>
    </div>
  );
};

export const TopicCardContainer: React.FC<TopicCardContainerProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={cn("overflow-hidden mb-14 sm:mb-20", className)}>
      <div className="max-container">
        <TopicHeader>{title}</TopicHeader>
      </div>
      <EdgelessScrollContainer>{children}</EdgelessScrollContainer>
    </div>
  );
};
