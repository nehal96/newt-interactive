interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  return (
    <h2 className="text-lg text-slate-400 font-light justify-self-center self-center text-center mb-8 md:mb-12 max-w-3xl md:text-xl">
      {children}
    </h2>
  );
};

export default Lede;
