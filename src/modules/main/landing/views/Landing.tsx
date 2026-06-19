import React from "react";
import HeroSection from "../Components/HeroSections";
import TopCourses from "../Components/TopCourses";
import WhyUsSection from "../Components/WhyUsSection";
import ReadySection from "../Components/ReadySections";

function Landing() {
  return (
    <div>
      <HeroSection />
      <TopCourses />
      <WhyUsSection />
      <ReadySection />
    </div>
  );
}

export default Landing;
