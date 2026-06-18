import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)] px-4 dark:bg-none dark:bg-[#1e1e1e]">
      <div className="max-w-md w-full bg-white dark:bg-[#333] rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-8 dark:text-[#ccc]">
          Your transaction was not completed. No charges were made to your
          account.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/courses"
            className="w-full bg-[#6d28d9] text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Explore Other Courses
          </Link>
          <Link
            href="/"
            className="w-full bg-white dark:bg-[#ddd] dark:text-black text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
