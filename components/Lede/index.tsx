interface Lede {
  children: React.ReactNode;
}

const Lede = ({ children }: Lede) => {
  return (
    <h2 className="font-xl text-slate-500 font-light justify-self-center self-center text-center mb-8 px-2 max-w-4xl sm:mb-12 lg:text-2xl lg:mb-16 lg:px-16">
      {children}
    </h2>
  );
};

export default Lede;
