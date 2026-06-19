import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import StarsRate from "../components/Stars";
import { formatDateEN } from "@/Utils/helper/DateConverter";
import { ICourseData } from "@/core/services/api/Get/GetAllCourses";
import Link from "next/link";

type props = {
  course: ICourseData;
  classNames?: string;
};

export default function CourseCard({ course, classNames = "" }: props) {
  return (
    <Card
      className={`${classNames} group hover:scale-[1.02] hover:shadow-2xl transition-all
       duration-300 overflow-hidden border-border/50`}
    >
      {/* Image Container */}
      <div className="w-full h-[220px] relative overflow-hidden">
        <Image
          src={course?.courseImage ?? "/images/NoImage.png"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Categories */}
        {course.categories && course.categories.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {course.categories.slice(0, 2).map((item) => (
              <span
                key={item._id}
                className="px-3 py-1 text-xs font-medium text-white bg-primary/90 backdrop-blur-md rounded-full shadow-lg"
              >
                {item.name}
              </span>
            ))}
            {course.categories.length > 2 && (
              <span className="px-3 py-1 text-xs font-medium text-white bg-primary/90 backdrop-blur-md rounded-full shadow-lg">
                +{course.categories.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <CardContent className="pt-4 pb-3 space-y-3">
        {/* Title */}
        <h2 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarsRate value={parseInt(course.rating.toFixed(0))} />
        </div>

        {/* Price and Date */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${course.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDateEN(course.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Link href={`/coursedetail/${course._id}`} className="w-full">
          <Button
            className="w-full group/btn hover:bg-primary/90 transition-all"
            size="lg"
          >
            <span>View Details</span>
            <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
