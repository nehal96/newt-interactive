import Link from "next/link";
import Image from "next/image";

interface TopicCardProps {
  href: string;
  imageSrc: string;
  title: string;
  darkText?: boolean;
  className?: string;
}

interface TopicHeaderProps {
  children: React.ReactNode;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({ children }) => {
  return (
    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 sm:mb-8">
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
}) => {
  const textColor = darkText ? "text-slate-800" : "text-white";

  return (
    <Link href={href} legacyBehavior>
      <a className={`mr-4 snap-start flex-shrink-0 ${className}`}>
        <div className="relative aspect-[3/4] h-[300px] lg:h-[350px] overflow-hidden rounded-md shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
          <Image
            src={imageSrc}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out hover:scale-105"
            alt={title}
          />
          <div>
            <h3
              className={`absolute bottom-4 left-4 text-lg font-semibold ${textColor}`}
            >
              {title}
            </h3>
          </div>
        </div>
      </a>
    </Link>
  );
};
