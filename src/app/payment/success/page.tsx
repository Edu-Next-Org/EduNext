"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");

  return (
    <div
      className="min-h-screen dark:bg-none flex items-center justify-center 
    bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)] px-4  dark:bg-[#1e1e1e]"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:bg-[#333]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6 dark:text-[#ccc]">
          Thank you for your purchase. The course has been added to your
          account.
        </p>

        {refId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200 text-left dark:bg-[#333]">
            <p className="text-sm text-gray-500 mb-1 dark:text-[#ccc]">
              Transaction Reference:
            </p>
            <p className="text-lg font-mono font-medium text-gray-800 break-all dark:text-white">
              {refId}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/userPanel/courses"
            className="w-full bg-[#6d28d9] text-white font-semibold py-3 px-4 rounded-xl  transition-colors"
          >
            Go to My Courses
          </Link>
          <Link
            href="/"
            className="w-full bg-[white] dark:bg-[#ddd] dark:text-black text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
