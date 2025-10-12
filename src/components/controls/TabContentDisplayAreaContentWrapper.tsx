export default function TabContentDisplayAreaContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="py-1 pr-4 pl-2">{children}</div>;
}
