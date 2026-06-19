import Container from "@/components/container/Container";
import { Button } from "@/components/ui/button";
import React from "react";

function ReadySection() {
  return (
    <Container>
      <div className=" w-full border-t-2 border-[#bbbb] pb-8 ">
        <div className="relative bottom-7 lg:bottom-9">
          <h2 className=" text-[18px] md:text-[28px] mx-auto font-bold  text-center p-3 h-[15%] rounded w-fit bg-[#eeee] dark:bg-[#1e1e1e]">
            Ready to Level Up Your Career ?
          </h2>
          <h3 className=" text-[15px] md:text-[21px]  text-center ">
            Join thousands of learners and start journey today !
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center ">
          <Button className="py-6 px-8 text-md font-bold ">
            Get Started Now
          </Button>
          <Button className="py-6 px-8 text-md font-bold  " variant="outline">
            Free Trial
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default ReadySection;
