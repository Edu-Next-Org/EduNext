"use client";
import Lottie from "lottie-react";
import fgAn from "../../../../assets/Lottie/ForgotPassword.json";
export default function ResetPasswordIllustration() {
  return (
    <div className="text-center md:text-left px-4 animate-fadeIn">
      <h1 className="font-bold text-[28px] md:text-[40px] leading-tight text-black dark:text-white">
        Forgot Your Password?
      </h1>

      <p className="text-gray-600 dark:text-[#898989] mt-3 text-sm md:text-base">
        Don’t worry! Enter your email and then set a new Password
      </p>

      <div className="mt-6">
        <Lottie
          animationData={fgAn}
          loop={true}
          className="w-full md:w-[600px]"
        />
      </div>
    </div>
  );
}
