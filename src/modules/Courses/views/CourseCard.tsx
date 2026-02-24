import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import StarsRate from "../components/Stars";
import { ICourses } from "../types/CoursesTP";
import { formatDateEN } from "@/Utils/helper/DateConverter";
import { ICourseData } from "@/core/services/api/Get/GetAllCourses";
import Link from "next/link";

type props = {
  course: ICourseData;
  classNames: string;
};
export default function CourseCard({ course, classNames }: props) {
  return (
    <Card
      className={`${classNames} hover:scale-101 hover:shadow-xl transition-all duration-200 `}
    >
      <div className="w-full h-[250px] relative overflow-hidden rounded-md">
        <Image
          src={course.courseImage}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-3 py-1 px-2 text-white bg-black/30 backdrop-blur-sm shadow-md rounded ">
          {course.categories.join(",")}
        </div>
      </div>
      <CardContent className=" mt-2 pb-1 ">
        <h2 className="text-[24px] font-bold ">{course.title}</h2>
        <div>
          <StarsRate value={course.rating} />
        </div>
        <div className="flex gap-4 items-center">
          <h2 className="text-[18px] font-bold">
            {course.price.toLocaleString()}$
          </h2>
          <span className="text-gray-700 text-l font-extrabold">.</span>
          <h3 className="text-sm text-gray-700">
            {formatDateEN(course.createdAt)}
          </h3>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={`/courses/${course._id}`}
          className="flex justify-between items-center w-full border-t border-[#bbbb] py-3 "
        >
          <Button>Learn More</Button>
          <ChevronRight />
        </Link>
      </CardFooter>
    </Card>
  );
}
