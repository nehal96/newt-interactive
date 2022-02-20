import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./youtubeEmbed.module.css";

interface YoutubeEmbedProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  embedId: string;
  start?: number;
}

const YoutubeEmbed = ({ embedId, start }: YoutubeEmbedProps) => {
  return (
    <div className={styles["video-responsive"]}>
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube-nocookie.com/embed/${embedId}${
          start ? `?start=${start}` : ""
        }`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
      />
    </div>
  );
};

export default YoutubeEmbed;
