import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center w-full box-border h-20 px-8 bg-indigo-400">
      <div className="max-w-7xl">
        <Link href="/">
          <div
            className="font-logo text-4xl text-white"
            style={{ lineHeight: "60px" }}
          >
            newt <span className="font-body text-3xl">interactive</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
