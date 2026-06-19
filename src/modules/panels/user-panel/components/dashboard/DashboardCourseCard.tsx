import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  author: string;
  progress: number;
  image: string;
}

export default function DashboardCourseCard({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition">
      <div className="relative h-50 w-full">
        <Image
          src={"/images/NoImage.png"}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.author}</p>
        </div>

        <Progress className="" value={course.progress} />

        <Button className="w-full">
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
