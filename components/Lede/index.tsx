interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  return (
    <h2 className="text-xl text-slate-400 font-light justify-self-center self-center text-center mb-14 px-2 max-w-4xl lg:text-2xl lg:mb-20 lg:px-16">
      {children}
    </h2>
  );
};

export default Lede;
