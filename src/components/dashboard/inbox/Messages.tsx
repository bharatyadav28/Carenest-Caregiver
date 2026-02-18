"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

import NameHeader from "./NameHeader";
import Chat from "./Chat";
import InputMessage from "./InputMessage";
import { useSocket } from "@/hooks/use-socket";
import { chatMessageType } from "@/lib/interface-types";

const ADMIN_ID = "Q5jvPEYY22YTV1Ut3kROw"; // Admin ID for chat

function Messages() {
  const [messages, setMessages] = useState<chatMessageType[]>([]);
  const [otherUserDetails, setOtherUserDetails] = useState<any>(null);

  const token = Cookies.get("authToken");
  const { sendMessage, onNewMessage } = useSocket(token);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `https://api.careworks.biz/api/v1/message/${ADMIN_ID}/chat-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        setOtherUserDetails(data.data.otherUserDetails || { name: "Admin", avatar: null });

        setMessages(
          (data.data.messages || []).map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            conversationId: msg.conversationId || "",
            isOtherUserMessage: msg.isOtherUserMessage,
            message: msg.message,
            createdAt: msg.createdAt || new Date().toISOString(),
            hasRead: msg.hasRead ?? false,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };
    fetchChatHistory();
  }, [token]);

  // Listen for new socket messages
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (!data) return;

      if (data.fromUserId === ADMIN_ID || data.toUserId === ADMIN_ID) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.id)) return prev; // prevent duplicate
          return [
            ...prev,
            {
              id: data.id || Date.now().toString(),
              conversationId: data.conversationId || "",
              isOtherUserMessage: data.fromUserId === ADMIN_ID,
              message: data.message,
              createdAt: data.createdAt || new Date().toISOString(),
              hasRead: data.hasRead ?? false,
            },
          ];
        });
      }
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage]);

  const addMessage = (msg: chatMessageType) => {
    setMessages((prev) => {
      if (prev.find((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  };

  return (
    <div className="flex-grow flex flex-col h-full min-h-0">
      <NameHeader />
      <div className="flex-1 overflow-hidden">
        <Chat messages={messages} otherUserDetails={otherUserDetails} />
      </div>
      <InputMessage userId={ADMIN_ID} addMessage={addMessage} sendMessage={sendMessage} />
    </div>
  );
}

export default Messages;