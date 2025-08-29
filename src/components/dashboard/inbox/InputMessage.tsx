import React, { useState, useEffect } from "react";
import { LuSend as SendIcon } from "react-icons/lu";
import { IoIosAttach as AttachmentIcon } from "react-icons/io";
import Cookies from "js-cookie";

import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/use-socket";

function InputMessage() {
  const [message, setMessage] = useState("");

  const token = Cookies.get("authToken");

  const { sendMessage, onNewMessage } = useSocket(token);
  const handleSendMessage = () => {
    // Implement send message logic here

    sendMessage("0Ti7wxilDTXm4M-yX_c8Y", "Nhi btaunga");
  };

  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      console.log("New message received:", msg);
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage]);

  return (
    <div className="flex items-center rounded-lg px-4 py-1 bg-[#F7F7F3]  ">
      <div className="flex grow-1 gap-4 items-center">
        <button>
          <AttachmentIcon size={21} className="text-[var(--cool-gray)] " />
        </button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="ps-0 border-none focus-visible:ring-0  text-[var(--cool-gray)]"
          placeholder="Write here..."
        />
      </div>

      <button onClick={handleSendMessage}>
        <SendIcon size={18} className="text-[var(--blue-gray)] " />
      </button>
    </div>
  );
}

export default InputMessage;
