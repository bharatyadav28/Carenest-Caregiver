// types/notification.ts
export type NotificationType = 
  | "booking" 
  | "user" 
  | "system" 
  | "message" 
  | "payment";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}