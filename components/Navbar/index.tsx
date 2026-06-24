import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center w-full box-border h-14 md:h-20 px-5 md:px-8 bg-indigo-400">
      <div className="max-w-7xl">
        <Link href="/">
          <div
            className="font-logo text-3xl md:text-4xl text-white leading-none"
          >
            newt <span className="font-body text-2xl md:text-3xl">interactive</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
