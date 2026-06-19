import { Button } from "@/components/ui/button";
import DashboardCourseCard from "./DashboardCourseCard";
import { ArrowRight, MoveRight } from "lucide-react";

interface Course {
  id: number;
  title: string;
  author: string;
  progress: number;
  image: string;
}

export default function CoursesSection({ courses }: { courses: Course[] }) {
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">Continue Learning</h2>
        <Button variant="ghost" size="sm">
          View All <ArrowRight />
        </Button>
      </div>

      <div className="grid gap-9 md:grid-cols-2">
        {courses.slice(0, 2).map((course) => (
          <DashboardCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
