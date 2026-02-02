import Container from "@/components/container/Container";
import React from "react";
import WhyUs from "./WhyUs";

function WhyUsSection() {
  return (
    <Container>
      <div className="w-full min-h-[350px] border-t-2  border-[#bbbb]  ">
        <h2 className="text-2xl mx-auto font-bold relative bottom-8 text-center p-3 h-[15%] rounded w-fit bg-[#eeee] dark:bg-[#1e1e1e] ">
          Why Learn Us ?
        </h2>
        <div className="w-full h-[80%]">
          <WhyUs />
        </div>
      </div>
    </Container>
  );
}

export default WhyUsSection;
