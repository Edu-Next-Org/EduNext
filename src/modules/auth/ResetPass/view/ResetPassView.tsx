import ResetPasswordForm from "../Components/form";
import ResetPasswordHeader from "../Components/header";
import ResetPasswordIllustration from "../Components/ResetPasswordIllustration";

export default function ResetPasswordView() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 dark:bg-[#222] transition-colors duration-300">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 animate-fadeIn">
        <ResetPasswordIllustration />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div
          className="bg-white dark:bg-[#333] 
          shadow-[0_0_12px_4px_#ccc] 
          dark:shadow-[0_0_20px_4px_#644DB3]
          rounded-2xl 
          w-full max-w-[450px] 
          px-6 py-10 
          animate-slideUp"
        >
          <ResetPasswordHeader />
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
