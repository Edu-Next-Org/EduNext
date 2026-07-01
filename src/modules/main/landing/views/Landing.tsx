import HeroSection, { ILandingData } from "../Components/HeroSections";
import TopCourses from "../Components/TopCourses";
import WhyUsSection from "../Components/WhyUsSection";
import ReadySection from "../Components/ReadySections";

function Landing({ data }: { data: ILandingData | null }) {
  return (
    <div>
      <HeroSection data={data} />
      <TopCourses />
      <WhyUsSection />
      <ReadySection />
    </div>
  );
}

export default Landing;
