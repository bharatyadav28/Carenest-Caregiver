// hooks/use-socket.tsx
"use client";
import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://carenest-backend-8y2y.onrender.com";
// const SOCKET_URL = "http://localhost:4000";

interface UseSocketReturn {
  sendMessage: (toUserId: string, message: string) => void;
  onNewMessage: (callback: (msg: any) => void) => void;
  onNewNotification: (callback: (notification: any) => void) => void;
  disconnect: () => void;
}

export const useSocket = (token?: string): UseSocketReturn => {
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
      // User is automatically in their notification room now
      console.log("User automatically subscribed to notifications via room join");
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

  const onNewNotification = (callback: (notification: any) => void) => {
    socketRef.current?.on("new_notification", callback);
  };

  const disconnect = () => {
    socketRef.current?.disconnect();
  };

  return { 
    sendMessage, 
    onNewMessage, 
    onNewNotification,
    disconnect 
  };
};