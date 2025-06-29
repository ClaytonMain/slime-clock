import type { ReactNode } from "react";

export default function TabContentDisplayArea({
  children,
}: {
  children?: ReactNode;
}) {
  return <div className="h-full w-44 flex-none p-2">{children}</div>;
}
