"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://carenest-backend-8y2y.onrender.com";

export const useSocket = (token?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
      socketRef.current?.emit("join");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const sendMessage = (toUserId: string, message: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", { toUserId, message });
    } else {
      console.error("Socket not connected yet");
    }
  };

  const onNewMessage = (callback: (msg: any) => void) => {
    socketRef.current?.on("new_message", callback);
  };

  return { sendMessage, onNewMessage };
};
