"use client";
import React from "react";
import CountUp from "react-countup";

function HeroCount() {
  return (
    <div className="flex lg:flex-row flex-col py-2  lg:px-10 justify-center lg:justify-between items-center">
      <div className="flex gap-3 items-center ">
        <h1 className=" text-[24px] lg:text-[32px] font-bold text-[#3d1dbf] ">
          <CountUp end={12} duration={3} />
          k+
        </h1>

        <h3 className="lg:text-[22px]  ">Students Enrolled</h3>
      </div>
      <div className="flex gap-3 items-center border-y-2 lg:border-y-0 lg:border-x-2 border-[#dddd] py-2 lg:py-0 lg:px-10 ">
        <h1 className="text-[24px] lg:text-[32px] font-bold text-[#3d1dbf] ">
          <CountUp end={350} duration={3} />+
        </h1>
        <h3 className="lg:text-[22px]">Expert Instructors</h3>
      </div>
      <div className="flex gap-3 items-center ">
        <h1 className="text-[24px] lg:text-[32px] font-bold text-[#3d1dbf] ">
          <CountUp end={54} duration={3} />+
        </h1>
        <h3 className="lg:text-[22px]">Lessons Viewed </h3>
      </div>
    </div>
  );
}

export default HeroCount;
