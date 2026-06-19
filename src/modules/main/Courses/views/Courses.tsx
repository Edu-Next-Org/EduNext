import Container from "@/components/container/Container";
import React from "react";
import SearchCourse from "../components/Search";
import SideFilters from "../components/side/SideFilters";
import MainCourses from "../components/main/MainCourses";
import { ICourseParams } from "@/app/(main)/courses/page";

function Courses({ params }: { params: ICourseParams }) {
  return (
    <div>
      <div className="border-b border-[#bbbb] ">
        <Container>
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-bold  ">Browse Courses</h1>
            <h4 className=" text-[16px] text-gray-500">
              Find the perfect course for you !
            </h4>
            <div>
              <SearchCourse />
            </div>
          </div>
        </Container>
      </div>
      <div>
        <Container>
          <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row  items-center lg:items-start lg:justify-between">
            <div className=" w-full lg:w-[20%] ">
              <SideFilters />
            </div>
            <div className=" w-full lg:w-[78%] ">
              <MainCourses params={params} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Courses;
