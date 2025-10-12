import type { ReactNode } from "react";

export default function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <span className="mx-1 rounded-xs bg-[#fff2] px-1 py-0.5 font-mono">
      {children}
    </span>
  );
}
