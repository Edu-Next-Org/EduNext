import Layouts from "@/components/Layouts/Layouts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layouts>{children}</Layouts>;
}