import React from "react";
import Image from "next/image";
import { VideoPlayer } from "@/modules/CourseDetails/VideoPlayer";
import { EnrollCard } from "@/modules/CourseDetails/EnrollCard";
import {
  StaggerWrapper,
  FadeInItem,
} from "../../../../modules/CourseDetails/MotionWrappers";
import ReplyButton from "@/modules/CourseDetails/ReplyButton";
import AddComment from "@/modules/CourseDetails/AddComment";
import {
  GetCourseByID,
  CourseDetailData,
} from "@/core/services/api/Get/GetCourseByID";
import ReviewSection from "@/modules/CourseDetails/ReviewSection";

interface SyllabusItem {
  id: number;
  instructor: string;
  lessonName: string;
  status: "Watched" | "Locked" | "Pending";
  avatar: string;
}

interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: string;
  replies?: Review[];
}

interface CourseData {
  title: string;
  description: string;
  price: number;
  syllabus: SyllabusItem[];
  reviews: Review[];
}

async function getCourseData(id: string): Promise<CourseData> {
  return {
    title: "Explore Our Comprehensive",

    description:
      "Them ipsum dolor, Wet than rho mert sii oes!- sreund hain cloirers ardon and bistendin, strenit alliay, tesill, the vereel magh on he anidit of wiad. Use this section to explain the course in detail without using tabs.",
    price: 5.0,

    syllabus: [
      {
        id: 1,
        instructor: "Fyrady Navp",
        lessonName: "Intro to Design",
        status: "Watched",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        id: 2,
        instructor: "Coj Mtad",
        lessonName: "Lideo Lessons",
        status: "Watched",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      {
        id: 3,
        instructor: "Pnoea Pesson",
        lessonName: "Color Theory",
        status: "Watched",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      {
        id: 4,
        instructor: "Lnetis Raay",
        lessonName: "Typography",
        status: "Pending",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      {
        id: 5,
        instructor: "Tiiee Pesson",
        lessonName: "Layouts",
        status: "Pending",
        avatar: "https://i.pravatar.cc/150?img=20",
      },
    ],
    reviews: [
      {
        id: 1,
        name: "Vicreo Rday",
        role: "Student",
        text: "Amazing content! really helped me.",
        avatar: "https://i.pravatar.cc/150?img=32",
        rating: "2025/7/3",
      },
      {
        id: 2,
        name: "Anna Smith",
        role: "Designer",
        text: "The instructor is very clear.",
        avatar: "https://i.pravatar.cc/150?img=41",
        rating: "2025/7/3",
      },
      {
        id: 3,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 4,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 5,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 6,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 7,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 8,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 9,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 10,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
      {
        id: 11,
        name: "John Doe",
        role: "Developer",
        text: "Good value for the price.",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: "2025/7/3",
      },
    ],
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCourseData(id);
  const course: CourseDetailData = await GetCourseByID(id);

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
            <VideoPlayer key={id} courseId={id} initialData={course} />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[#1F1D43] inline-block pb-1 dark:text-[white] dark:border-[white] ">
                Description
              </h2>
              <p className="text-gray-600 leading-8 text-lg dark:text-[#898989] ">
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
              />
              <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100 dark:bg-[#333] dark:border-none">
                <h3 className="text-xl font-bold mb-5 px-1 dark:text-[white] ">
                  Course Syllabus
                </h3>
                <ul className="flex flex-col gap-2 ">
                  {data.syllabus.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#222] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.avatar}
                          alt="User avatar"
                          width={40}
                          height={40}
                          className="rounded-full grayscale group-hover:grayscale-0"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-800 dark:text-[white] ">
                            {item.instructor}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-[#898989] ">
                            {item.lessonName}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-1 dark:bg-[#444] rounded font-medium ${item.status === "Watched" ? "bg-purple-50 text-[#644DB3]" : "bg-gray-100 text-gray-400"}`}
                      >
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
