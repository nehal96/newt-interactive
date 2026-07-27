import Footer from "../Footer";
import Navbar from "../Navbar";

/**
 * The site chrome, in one place: navbar, page, footer, as a column flex with a
 * growing middle — so the footer sits at the bottom of the viewport on a short
 * page rather than halfway up it.
 *
 * Every page renders through this, whether it comes from MDX (via MdxLayout)
 * or is built by hand (the homepage). That's the point: a change to the chrome
 * lands on all of them, rather than on whichever copies of it got found.
 */
const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-auto">{children}</main>
    <Footer />
  </div>
);

export default PageShell;
