import LoginForm from "@/modules/Login/LoginForm";
import LoginGif from "@/modules/Login/LoginGif";

export default function Login() {
  return (
    <div
      className=" dark:bg-none dark:bg-[#1e1e1e]  
    bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)] flex flex-col md:flex-row justify-between h-auto md:h-screen px-4 md:px-30 gap-10 md:gap-0"
    >
      <div className="h-auto md:h-full w-full md:w-[50%] flex items-center justify-center pt-10 md:pt-0">
        <LoginGif />
      </div>

      <div className="h-auto md:h-full w-full md:w-[50%] flex items-center justify-center pb-10 md:pb-0">
        <LoginForm />
      </div>
    </div>
  );
}
