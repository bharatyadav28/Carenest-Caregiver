// context/NotificationContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSocket } from "@/hooks/use-socket";
import { useGetUnreadCountQuery } from "../store/api/notificationApi";
import { Notification } from "../lib/types/notification";

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const token = Cookies.get("authToken");
  
  const { data } = useGetUnreadCountQuery();
  const { onNewNotification } = useSocket(token);
  
  const unreadCount = data?.data?.unreadCount || 0;

  useEffect(() => {
    if (!token) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    onNewNotification(handleNewNotification);
  }, [token, onNewNotification]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true, readAt: new Date().toISOString() } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        addNotification,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};