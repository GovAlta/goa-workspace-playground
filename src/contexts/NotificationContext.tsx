import { createContext, useContext, useState, type ReactNode } from "react";

export type NotificationType = "info" | "success" | "warning" | "critical";
export type NotificationReadStatus = "read" | "unread";
export type NotificationPriority = "normal" | "urgent";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
  readStatus: NotificationReadStatus;
  priority: NotificationPriority;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  urgentCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
}

const daysAgo = (days: number, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Comments",
    description: "Harvey Don commented on your assigned case.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "2",
    title: "Case Transfer",
    description: "Case #4521 has been transferred to your queue.",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "3",
    title: "Case Review",
    description: "Your case #2451 is pending review by Sarah Mitchell.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "4",
    title: "Application Received",
    description: "New application #9912 received from Jennifer Lopez.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "5",
    title: "Deadline Reminder",
    description: "Case #3187 documentation is due in 2 days.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    type: "warning",
    readStatus: "unread",
    priority: "urgent",
  },
  {
    id: "6",
    title: "Mention",
    description: "You were mentioned in a comment by Patricia Williams.",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "7",
    title: "Missing Information",
    description: "Case #5543 requires additional documentation to proceed.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: "warning",
    readStatus: "unread",
    priority: "urgent",
  },
  {
    id: "8",
    title: "Reminder",
    description:
      "You have 3 pending case reviews scheduled for this week.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "9",
    title: "Payment Issue",
    description:
      "Payment processing failed for application #8842. Action required.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    type: "critical",
    readStatus: "unread",
    priority: "urgent",
  },
  {
    id: "10",
    title: "Assignment",
    description: "Rita Lee assigned you a new case.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "11",
    title: "Meeting Request",
    description: "David Chen requested a meeting about case #6734.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "12",
    title: "Incoming outage",
    description:
      "Income and Employment Support (IES) service will be under maintenance from Thursday, September 15, 2024 at 10pm to Friday, September 16, 2024 at 10am.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    type: "critical",
    readStatus: "unread",
    priority: "urgent",
  },
  {
    id: "13",
    title: "Security Alert",
    description:
      "Suspicious login attempt detected. Please verify your recent activity.",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    type: "critical",
    readStatus: "unread",
    priority: "urgent",
  },
  {
    id: "14",
    title: "Status Change",
    description: "Case #7756 status changed to 'Under Investigation'.",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "15",
    title: "Document Upload",
    description: "Michael Zhang uploaded new documents to case #5523.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    type: "info",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "16",
    title: "Duplicate Application",
    description:
      "Potential duplicate application detected for client ID #4456.",
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    type: "warning",
    readStatus: "unread",
    priority: "normal",
  },
  {
    id: "17",
    title: "Appeal Submitted",
    description: "Client #8823 has submitted an appeal for case #3344.",
    timestamp: daysAgo(30, 3),
    type: "warning",
    readStatus: "unread",
    priority: "urgent",
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(
    (n) => n.readStatus === "unread",
  ).length;

  const urgentCount = notifications.filter(
    (n) => n.priority === "urgent",
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id && notif.readStatus === "unread"
          ? { ...notif, readStatus: "read" as const }
          : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, readStatus: "read" as const })),
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, urgentCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
