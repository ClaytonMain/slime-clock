import type { ReactNode } from "react";

export default function TabContentDisplayArea({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <div className="h-full w-44 flex-none border border-dashed border-emerald-400 p-2">
      {children}
    </div>
  );
}
