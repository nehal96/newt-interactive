interface Title {
  children: React.ReactNode;
}

const Title = ({ children }: Title) => {
  return (
    <h1 className="font-title text-5xl justify-self-center self-center text-center lg:text-6xl lg:mb-10">
      {children}
    </h1>
  );
};

export default Title;
