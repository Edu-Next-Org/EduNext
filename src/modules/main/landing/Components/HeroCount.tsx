"use client";
import CountUp from "react-countup";
import { ILandingData } from "./HeroSections";

function HeroCount({ data }: { data: ILandingData | null }) {
  return (
    <div className="flex lg:flex-row flex-col py-2  lg:px-10 justify-center lg:justify-between items-center dark:bg-[#333] rounded-2xl">
      <div className="flex gap-3 items-center  ">
        <h1 className=" text-[24px] lg:text-[32px] font-bold text-violet-600 ">
          <CountUp end={data?.totalStudents ?? 0} duration={11} />
        </h1>

        <h3 className="lg:text-[22px]  ">Students Enrolled</h3>
      </div>
      <div className="flex gap-3 items-center border-y-2 lg:border-y-0 lg:border-x-2 border-[#dddd] py-2 lg:py-0 lg:px-10 ">
        <h1 className="text-[24px] lg:text-[32px] font-bold text-violet-600 ">
          <CountUp end={data?.totalTeachers ?? 0} duration={11} />+
        </h1>
        <h3 className="lg:text-[22px]">Expert Instructors</h3>
      </div>
      <div className="flex gap-3 items-center ">
        <h1 className="text-[24px] lg:text-[32px] font-bold text-violet-600 ">
          <CountUp end={data?.totalCourses ?? 0} duration={11} />+
        </h1>
        <h3 className="lg:text-[22px]">Courses</h3>
      </div>
    </div>
  );
}

export default HeroCount;
