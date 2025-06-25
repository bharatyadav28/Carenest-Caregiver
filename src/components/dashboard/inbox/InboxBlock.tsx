"use client";
import React, { useState } from "react";

import MessageList from "./MessageList";
import Messages from "./Messages";
import CustomSheet from "@/components/common/CustomSheet";

function InboxBlock() {
  const [openMessages, setOpenMessages] = useState(false);
  const myMessages = <Messages />;

  const handleOpenMessages = () => {
    setOpenMessages((prev) => !prev);
  };

  return (
    <div className="  grid grid-cols-12 gap-6 ">
      <div className="col-start-1 md:col-end-6 col-end-13 card ">
        <MessageList handleOpenMessages={handleOpenMessages} />
      </div>

      <div className="col-start-6 col-end-13 card md:flex flex-grow overflow-y-auto hidden  ">
        {myMessages}
      </div>

      <div>
        <CustomSheet
          open={openMessages}
          handleOpen={handleOpenMessages}
          className="py-10"
          showCrossButton={true}
        >
          {myMessages}
        </CustomSheet>
      </div>
    </div>
  );
}

export default InboxBlock;
