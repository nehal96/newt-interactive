import { Navbar } from "..";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-auto h-full w-full max-w-5xl p-12">
        {children}
      </main>
    </div>
  );
}
