import { Footer, Navbar } from "@ui/site";

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-auto">{children}</main>
    <Footer />
  </div>
);

export default PageShell;
