interface Title {
  children: React.ReactNode;
}

const Title = ({ children }: Title) => {
  return (
    <h1 className="font-title text-5xl justify-self-center self-center text-center my-10 lg:text-6xl">
      {children}
    </h1>
  );
};

export default Title;
