import Navbar from "@/modules/layout/header/views/Navbar";
import Footer from "@/modules/layout/footer/views/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[82px]">{children}</div>
      <Footer />
    </>
  );
}
