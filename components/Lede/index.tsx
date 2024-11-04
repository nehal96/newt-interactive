interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  return (
    <h2 className="text-lg text-slate-400 font-light justify-self-center self-center text-center mb-12 md:mb-16 max-w-3xl md:text-xl">
      {children}
    </h2>
  );
};

export default Lede;
