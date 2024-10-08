import Link from "next/link";
import Image from "next/image";

interface HomepageTopicCardProps {
  href: string;
  imageSrc: string;
  title: string;
  darkText?: boolean;
}

const HomepageTopicCard: React.FC<HomepageTopicCardProps> = ({
  href,
  imageSrc,
  title,
  darkText = false,
}) => {
  const textColor = darkText ? "text-slate-800" : "text-white";

  return (
    <Link href={href} legacyBehavior>
      <a className="mr-4 mb-4">
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

export default HomepageTopicCard;
