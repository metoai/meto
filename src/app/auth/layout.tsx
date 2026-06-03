export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-[1] h-dvh overflow-hidden">{children}</div>
  );
}
