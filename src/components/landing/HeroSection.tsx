import Image from "next/image";
import Container from "../container/Container";
import { Button } from "../ui/button";
import HeroCount from "./Numbers/HeroCount";
import Layouts from "../Layouts/Layouts";

function HeroSection() {
  return (
    <div>
      <section className="relative h-[80vh] flex items-center">
        <Image
          src="/images/hero.png"
          alt="learn"
          fill
          className="object-cover "
          priority
        />
        <div className="absolute inset-0 bg-black/40 -z-10"></div>
        <div className="absolute inset-0 mt-6 lg:mt-35">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:px-20 px-6 py-8 ">
            <div className="w-[67%] lg:w-full">
              <h1 className="text-3xl lg:text-6xl font-bold mb-6">
                Learn Without Limits
              </h1>

              <p className="lg:text-xl mb-8">
                Access thousands of courses from industry experts. Build skills,
                earn certificates, and advance your career.
              </p>

              <div className="flex gap-4">
                <Button className="py-5 font-bold lg:text-lg ">
                  Browse Courses
                </Button>

                <Button
                  variant="secondary"
                  className="py-5 lg:text-lg  font-bold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="lg:px-20 px-6 py-3  bg-[#eeee]">
        <div className="mx-auto  bg-[#ffff] rounded shadow lg:w-[75%] relative bottom-10 ">
          <Layouts>
            <HeroCount />
          </Layouts>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
