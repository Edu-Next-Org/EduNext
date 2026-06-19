import React from "react";
import { VideoPlayer } from "@/modules/main/CourseDetails/VideoPlayer";
import { EnrollCard } from "@/modules/main/CourseDetails/EnrollCard";
import {
  StaggerWrapper,
  FadeInItem,
} from "../../../../modules/main/CourseDetails/MotionWrappers";
import AddComment from "@/modules/main/CourseDetails/AddComment";
import { GetCourseByID } from "@/core/services/api/Get/GetCourseByID";
import ReviewSection from "@/modules/main/CourseDetails/ReviewSection";
import RelatedCourses from "@/modules/main/CourseDetails/RelatedCourses";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await GetCourseByID(id);

  return (
    <StaggerWrapper className="min-h-screen dark:bg-none dark:bg-[#1e1e1e] bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)] text-[#1F1D43] pb-10">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <FadeInItem className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight dark:text-[white]">
            {course.title}
          </h1>
        </FadeInItem>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
          <FadeInItem className="lg:col-span-8 flex flex-col gap-4 order-1">
            <VideoPlayer courseId={id} courseData={course} />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[#1F1D43] inline-block pb-1 dark:text-[white] dark:border-[white]">
                Description
              </h2>
              <p className="text-gray-600 leading-8 truncate text-lg dark:text-[#898989]">
                {course.description}
              </p>
            </div>

            <div className="hidden lg:block lg:order-3">
              <AddComment courseId={id} />
            </div>

            <div className="hidden lg:block lg:order-4">
              <ReviewSection courseId={id} />
            </div>
          </FadeInItem>

          <FadeInItem className="lg:col-span-4 order-2">
            <div className="lg:sticky lg:top-24 space-y-8">
              <EnrollCard
                price={course.price}
                teacherName={course.teacherName}
                teacherImage={course.teacherImage}
                initialIsFavorite={course.isFavorite || false}
                isPurchased={course.isPurchased}
                courseId={id}
              />
              <RelatedCourses courseId={id} />
            </div>
          </FadeInItem>

          <FadeInItem className="order-3 lg:hidden mt-4">
            <AddComment courseId={id} />
          </FadeInItem>

          <FadeInItem className="order-4 lg:hidden mt-4">
            <ReviewSection courseId={id} />
          </FadeInItem>
        </div>
      </div>
    </StaggerWrapper>
  );
}
