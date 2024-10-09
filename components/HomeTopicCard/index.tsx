import Link from "next/link";
import Image from "next/image";

interface HomeTopicCardProps {
  href: string;
  imageSrc: string;
  title: string;
  altText: string;
}

export const HomeTopicCard: React.FC<HomeTopicCardProps> = ({
  href,
  imageSrc,
  title,
  altText,
}) => {
  return (
    <Link href={href} className="mr-6 sm:mr-12 mb-6">
      <div className="w-28 sm:w-40 bg-white rounded-xl shadow-md cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg">
        <div>
          <Image
            src={imageSrc}
            height={160}
            width={160}
            className="rounded-t-xl"
            alt={altText}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
        <div className="p-3 sm:p-5">
          <h3 className="sm:text-lg font-medium text-slate-800">{title}</h3>
        </div>
      </div>
    </Link>
  );
};
