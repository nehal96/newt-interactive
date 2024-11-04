interface Title {
  children: React.ReactNode;
}

const Title = ({ children }: Title) => {
  return (
    <h1 className="font-title text-4xl justify-self-center self-center text-center my-3 sm:my-5 md:my-6 md:text-5xl">
      {children}
    </h1>
  );
};

export default Title;
