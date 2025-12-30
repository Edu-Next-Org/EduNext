import CourseCard from "@/components/CourseCard/CourseCard";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ReadySection from "@/components/landing/ReadySection";
import TopCourses from "@/components/landing/TopCourses";
import WhyUsSection from "@/components/landing/WhyUsSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopCourses />
      <WhyUsSection />
      <ReadySection />
      <Footer />
    </div>
  );
}
