import React from "react";

import InboxBlock from "@/components/dashboard/inbox/InboxBlock";
import DashboardMenu from "@/components/dashboard/DashboardMenu";

function page() {
  return (
    <div className="my-10 grid grid-cols-24 ">
      <div className="col-start-1 col-end-6 ">
        <DashboardMenu />
      </div>

      <div className="lg:col-start-7 lg:col-end-25 col-start-1 col-end-25 g:mt-0 ">
        {<InboxBlock />}
      </div>
    </div>
  );
  return;
}

export default page;
