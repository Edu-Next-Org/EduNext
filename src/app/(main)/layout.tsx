import Navbar from "@/modules/header/views/Navbar";
import Footer from "@/modules/footer/views/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[83px]">
        {children}
      </div>
      <Footer />
    </>
  );
}