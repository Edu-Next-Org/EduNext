"use client";
import Lottie from "lottie-react";
import LearnAn from "../../../assets/Lottie/Learning.json";
import CretificateAn from "../../../assets/Lottie/Cerificate.json";
import UserAn from "../../../assets/Lottie/user.json";
function WhyUs() {
  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 md:gap-0 md:justify-between items-center ">
      <div className="flex flex-col gap-3 items-center flex-1/3">
        <div className="w-[40%] h-[40%] rounded-full bg-[#ffff] ">
          <Lottie animationData={UserAn} loop={true} />
        </div>
        <h2 className="font-bold text-xl ">Expert Instruction</h2>
        <h3>Learning from industry leaders</h3>
      </div>
      <div className="flex flex-col gap-3 items-center flex-1/3 ">
        <div className="w-[40%] h-[40%] rounded-full bg-[#ffff] ">
          <Lottie animationData={LearnAn} loop={true} />
        </div>
        <h2 className="font-bold text-xl ">Flexible Learning </h2>
        <h3>Study anytime , anyWhere</h3>
      </div>
      <div className="flex flex-col gap-3 items-center flex-1/3 ">
        <div className="w-[40%] h-[40%] rounded-full bg-[#ffff] ">
          <Lottie animationData={CretificateAn} loop={true} />
        </div>
        <h2 className="font-bold text-xl ">Certifications</h2>
        <h3>Earn recognize certificates</h3>
      </div>
    </div>
  );
}

export default WhyUs;
