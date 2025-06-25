import React from "react";

import NoItems from "@/components/common/NoItems";
import NameHeader from "./NameHeader";
import Chat from "./Chat";
import InputMessage from "./InputMessage";

function Messages() {
  const noMessages = false;

  return (
    <div className="flex-grow flex h-[45rem] ">
      {noMessages && <NoItems className="mt-[10rem]" />}

      {!noMessages && (
        <div className="flex-grow flex flex-col justify-between overflow-y-auto md:px-0 px-2 ">
          <NameHeader />
          <Chat />
          <InputMessage />
        </div>
      )}
    </div>
  );
}

export default Messages;
