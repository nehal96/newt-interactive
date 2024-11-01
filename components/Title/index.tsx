interface Title {
  children: React.ReactNode;
}

const Title = ({ children }: Title) => {
  return (
    <h1 className="font-title text-4xl justify-self-center self-center text-center mt-10 mb-3 sm:mb-5 md:mb-6 md:text-5xl">
      {children}
    </h1>
  );
};

export default Title;
