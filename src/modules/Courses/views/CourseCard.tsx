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

export default function CourseCard({ classNames }: { classNames: string }) {
  return (
    <Card
      className={`${classNames} hover:scale-101 hover:shadow-xl transition-all duration-200 `}
    >
      <div className="w-full h-[250px] relative overflow-hidden rounded-md">
        <Image
          src="/images/hero.png"
          alt="learn"
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-3 py-1 px-2 text-white bg-black/30 backdrop-blur-sm shadow-md rounded ">
          Web Development
        </div>
      </div>
      <CardContent className=" mt-2 pb-1 ">
        <h2 className="text-[24px] font-bold ">Web Development Bootcamp</h2>
        <div>
          <StarsRate value={4.5} />
        </div>
        <div className="flex gap-4 items-center">
          <h2 className="text-[18px] font-bold">24h 30m</h2>
          <span className="text-gray-700 text-l font-extrabold">.</span>
          <h3 className="text-sm text-gray-700">1,200 students</h3>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center w-full border-t border-[#bbbb] py-3 ">
          <Button>Learn More</Button>
          <ChevronRight />
        </div>
      </CardFooter>
    </Card>
  );
}
