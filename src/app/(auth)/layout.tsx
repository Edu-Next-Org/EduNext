export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#eeee] dark:bg-[#1e1e1e]">{children}</div>
  );
}
