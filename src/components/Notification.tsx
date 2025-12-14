// components/Notification.tsx
"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack as BackIcon } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";

import CustomSheet from "./common/CustomSheet";
import { noNotificationIcon, Usernoty, Bookingnoty } from "@/lib/svg_icons";
import { useGetNotificationsQuery, useMarkAsReadMutation, useGetUnreadCountQuery } from "../store/api/notificationApi";
import { useSocket } from "@/hooks/use-socket";
import { Notification as NotificationType } from "../lib/types/notification";

interface Props {
  open: boolean;
  handleOpen: () => void;
}

function Notification({ open, handleOpen }: Props) {
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const token = Cookies.get("authToken");
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery(
    { page, limit },
    { skip: !open }
  );
  
  const { data: unreadCountData, refetch: refetchUnreadCount } = useGetUnreadCountQuery();
  const [markAsRead] = useMarkAsReadMutation();
  
  const { onNewNotification } = useSocket(token);
  
  const notifications = data?.data?.notifications || [];
  const totalPages = data?.data?.totalPages || 0;
  const hasMore = data?.data?.hasMore || false;
  const unreadCount = unreadCountData?.data?.unreadCount || 0;

  // Listen for real-time notifications
  useEffect(() => {
    if (!token) return;

    const handleNewNotification = (notification: NotificationType) => {
      // Refetch notifications when new one arrives
      refetch();
      refetchUnreadCount();
    };

    onNewNotification(handleNewNotification);
  }, [token, onNewNotification, refetch, refetchUnreadCount]);

  // Refetch when sheet opens
  useEffect(() => {
    if (open) {
      refetch();
      refetchUnreadCount();
    }
  }, [open, refetch, refetchUnreadCount]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
      refetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Some time ago";
    }
  };



  const noNotifications = !isLoading && notifications.length === 0;

  return (
    <CustomSheet
      open={open}
      handleOpen={handleOpen}
      className="md:!max-w-[28rem] !w-full rounded-l-3xl px-1 text-[var(--blue-gray)] mx-0 z-99999"
    >
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="bg-[#233D4D1A] border-0 p-2 rounded-full hover:bg-[#233D4D33] transition-colors"
              onClick={handleOpen}
              aria-label="Close notifications"
            >
              <BackIcon size={20} />
            </button>
            <div className="ms-[5rem] text-xl font-medium">Notifications</div>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col px-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {isLoading && page === 1 && (
            <div className="text-center py-8 text-gray-500">
              Loading notifications...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-500">
              Failed to load notifications
            </div>
          )}

          {noNotifications && !isLoading && (
            <div className="flex flex-col items-center gap-4 mt-10 p-2">
              <div className="text-gray-400">{noNotificationIcon}</div>
              <div className="text-gray-500 text-medium text-center">
                You have not received any notifications.
              </div>
            </div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-x-3 items-start cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors ${
                !notification.isRead ? "bg-blue-50 " : ""
              }`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            >
              {/* Unread indicator */}
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary mt-4 flex-shrink-0"></div>
              )}
              {notification.isRead && (
                <div className="w-2 h-2 mt-4 flex-shrink-0"></div>
              )}

              <div className="flex gap-3 items-start w-full">
                {/* Icon with background */}
                <div className={`bg-gray-100 text-gray-600 rounded-lg p-1 flex-shrink-0`}>
                {Bookingnoty}
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="text-[0.9rem] font-medium text-gray-900 line-clamp-2">
                      {notification.title}
                    </div>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {notification.description}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[#B9B9B9] text-xs">
                      {formatTime(notification.createdAt)}
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              className="mt-4 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Loading more..." : "Load More Notifications"}
            </button>
          )}

          {notifications.length > 0 && !hasMore && (
            <div className="text-center py-4 text-gray-400 text-sm">
              No more notifications
            </div>
          )}
        </div>

        {/* Mark all as read button (optional feature) */}
        {unreadCount > 0 && notifications.length > 0 && (
          <div className="mt-4 px-3 pb-4">
            <button
              onClick={() => {
                // You would need to implement markAllAsRead API endpoint
                notifications.forEach(notif => {
                  if (!notif.isRead) {
                    handleMarkAsRead(notif.id);
                  }
                });
              }}
              className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </CustomSheet>
  );
}

export default Notification;