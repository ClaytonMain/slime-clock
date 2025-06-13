import type { ReactNode } from "react";

export default function ControlContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-1 flex flex-col rounded-lg bg-red-300 p-2">
      {children}
    </div>
  );
}
