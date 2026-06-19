import NewPassView from "@/modules/auth/ResetPass/view/NewPassView";
import React from "react";

async function ForgotPass({ params }: { params: Promise<{ token: string }> }) {
  const data = await params;
  const { token } = data;
  return (
    <div>
      <NewPassView token={token} />
    </div>
  );
}

export default ForgotPass;
