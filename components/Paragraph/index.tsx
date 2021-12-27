import styles from "./Paragraph.module.css";

interface Paragraph {
  children: React.ReactNode;
}

const Paragraph = ({ children }: Paragraph) => {
  return (
    <p className="font-body text-lg text-slate-700 self-center max-w-3xl my-5 md:text-xl md:tracking-wide">
      {children}
    </p>
  );
};

export default Paragraph;
