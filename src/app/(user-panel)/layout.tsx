import DashboardContainer from "@/components/container/DashboardContainer";
import HorizantalNavView from "@/modules/user-panel/view/HorizantalNavView";
import VerticalNavView from "@/modules/user-panel/view/VerticalNavView";
import React from "react";

function UserPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardContainer>
      <div className=" flex flex-col w-full h-screen justify-between gap-5">
        <div>
          <HorizantalNavView />
        </div>

        <div className="lg:px-15 lg:flex lg:items-start lg:justify-between h-full ">
          <div className="lg:w-[20%] lg:h-[96%] hidden lg:block ">
            <VerticalNavView />
          </div>
          <div className=" px-5 w-full lg:w-[78%] lg:h-[96%]">{children}</div>
        </div>
      </div>
    </DashboardContainer>
  );
}

export default UserPanelLayout;
