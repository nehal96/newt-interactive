import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInViewport } from "@hooks";
import type { SandpackFiles } from "@codesandbox/sandpack-react";

const Sandbox = dynamic(() => import("./Sandbox"), {
  ssr: false,
  loading: () => <Placeholder />,
});

// Same height as the editor so scroll position doesn't jump on boot.
function Placeholder() {
  return (
    <div className="flex h-[500px] w-full items-center justify-center rounded-md bg-slate-900 text-xs text-slate-500">
      Loading editor…
    </div>
  );
}

export default function CodeSandbox({ files }: { files: SandpackFiles }) {
  const paneRef = useRef<HTMLDivElement>(null);
  const { hasBeenNear } = useInViewport(paneRef);

  return (
    <div ref={paneRef}>
      {hasBeenNear ? <Sandbox files={files} /> : <Placeholder />}
    </div>
  );
}
