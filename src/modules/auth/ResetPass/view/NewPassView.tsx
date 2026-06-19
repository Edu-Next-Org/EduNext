import React from "react";
import NewPasswordCard from "../Components/NewPasswordCard";

function NewPassView({ token }: { token: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#f3f0ff] to-[#e5dbff] 
      dark:from-[#1a1a2e] dark:to-[#16213e]
      px-4 transition-colors duration-300"
    >
      <NewPasswordCard token={token} />
    </div>
  );
}

export default NewPassView;
