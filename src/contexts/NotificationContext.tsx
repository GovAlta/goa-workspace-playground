import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Notification} from "../types/Notification";

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id">) => void;
    deleteNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    getUnreadCount: () => number;
    getNotificationsByTab: (tab: "all" | "unread" | "urgent") => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const stored = localStorage.getItem("notifications");
        if (stored && stored !== "[]") {
            const parsed = JSON.parse(stored);
            return parsed.map((notification: Notification) => ({
                ...notification,
                timestamp: new Date(notification.timestamp),
            }));
        } else {
            // Always start with sample notifications
            const sampleNotifications: Notification[] = [
                {
                    id: "1",
                    type: "default",
                    title: "Comments",
                    description: "Harvey Don commented on your assigned case.",
                    timestamp: new Date(Date.now() - 2 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                },
                {
                    id: "2",
                    type: "default",
                    title: "Assignment",
                    description: "Rita Lee assigned you a new case.",
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "New"
                },
                {
                    id: "3",
                    type: "warning",
                    title: "Incoming outage",
                    description: "Income and Employment Support (IES) service will be under maintenance from Thursday, September 15, 2024 at 10pm to Friday, September 16, 2024 at 10am.",
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: true,
                    badgeType: "important",
                    badgeContent: "Outage"
                },
                {
                    id: "4",
                    type: "info",
                    title: "Application update",
                    description: "Gilbert Barton's application for income support was approved.",
                    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
                    isRead: true,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "Approved"
                },
                {
                    id: "5",
                    type: "default",
                    title: "Case Review",
                    description: "Your case #2451 is pending review by Sarah Mitchell.",
                    timestamp: new Date(Date.now() - 30 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                },
                {
                    id: "6",
                    type: "warning",
                    title: "Deadline Reminder",
                    description: "Case #3187 documentation is due in 2 days.",
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: true,
                    badgeType: "important",
                    badgeContent: "Urgent"
                },
                {
                    id: "7",
                    type: "info",
                    title: "System Update",
                    description: "New features have been added to the reporting module.",
                    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
                    isRead: true,
                    isUrgent: false,
                },
                {
                    id: "8",
                    type: "default",
                    title: "Document Upload",
                    description: "Michael Zhang uploaded new documents to case #5523.",
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "New"
                },
                {
                    id: "9",
                    type: "warning",
                    title: "Payment Issue",
                    description: "Payment processing failed for application #8842. Action required.",
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: true,
                    badgeType: "important",
                    badgeContent: "Action Required"
                },
                {
                    id: "10",
                    type: "info",
                    title: "Training Available",
                    description: "New training session on policy updates scheduled for next week.",
                    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000),
                    isRead: true,
                    isUrgent: false,
                },
                {
                    id: "11",
                    type: "default",
                    title: "Case Transfer",
                    description: "Case #4521 has been transferred to your queue.",
                    timestamp: new Date(Date.now() - 20 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "New"
                },
                {
                    id: "12",
                    type: "default",
                    title: "Meeting Request",
                    description: "David Chen requested a meeting about case #6734.",
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                },
                {
                    id: "13",
                    type: "info",
                    title: "Policy Update",
                    description: "New income verification policy effective immediately.",
                    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
                    isRead: true,
                    isUrgent: false,
                    badgeType: "important",
                    badgeContent: "Policy"
                },
                {
                    id: "14",
                    type: "warning",
                    title: "Security Alert",
                    description: "Suspicious login attempt detected. Please verify your recent activity.",
                    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: true,
                    badgeType: "important",
                    badgeContent: "Security"
                },
                {
                    id: "15",
                    type: "default",
                    title: "Application Received",
                    description: "New application #9912 received from Jennifer Lopez.",
                    timestamp: new Date(Date.now() - 45 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "New"
                },
                {
                    id: "16",
                    type: "info",
                    title: "Case Closed",
                    description: "Case #2287 has been successfully closed.",
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                    isRead: true,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "Closed"
                },
                {
                    id: "17",
                    type: "default",
                    title: "Status Change",
                    description: "Case #7756 status changed to 'Under Investigation'.",
                    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                },
                {
                    id: "18",
                    type: "warning",
                    title: "Missing Information",
                    description: "Case #5543 requires additional documentation to proceed.",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: true,
                    badgeType: "important",
                    badgeContent: "Action Required"
                },
                {
                    id: "19",
                    type: "info",
                    title: "Report Generated",
                    description: "Monthly performance report is now available for download.",
                    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago (last week)
                    isRead: true,
                    isUrgent: false,
                },
                {
                    id: "20",
                    type: "default",
                    title: "Mention",
                    description: "You were mentioned in a comment by Patricia Williams.",
                    timestamp: new Date(Date.now() - 90 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                },
                {
                    id: "21",
                    type: "default",
                    title: "Team Update",
                    description: "Emily Johnson joined your team as a case worker.",
                    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (last week)
                    isRead: true,
                    isUrgent: false,
                },
                {
                    id: "22",
                    type: "warning",
                    title: "Duplicate Application",
                    description: "Potential duplicate application detected for client ID #4456.",
                    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
                    isRead: false,
                    isUrgent: true,
                    badgeType: "important",
                    badgeContent: "Review"
                },
                {
                    id: "23",
                    type: "info",
                    title: "Scheduled Maintenance",
                    description: "System backup scheduled for tonight at 11 PM EST.",
                    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                    isRead: true,
                    isUrgent: false,
                },
                {
                    id: "24",
                    type: "default",
                    title: "Appeal Submitted",
                    description: "Client #8823 has submitted an appeal for case #3344.",
                    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (full date)
                    isRead: false,
                    isUrgent: false,
                    badgeType: "important",
                    badgeContent: "Appeal"
                },
                {
                    id: "25",
                    type: "info",
                    title: "Verification Complete",
                    description: "Identity verification completed for application #7721.",
                    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago (full date)
                    isRead: true,
                    isUrgent: false,
                    badgeType: "success",
                    badgeContent: "Verified"
                },
                {
                    id: "26",
                    type: "default",
                    title: "Reminder",
                    description: "You have 3 pending case reviews scheduled for this week.",
                    timestamp: new Date(Date.now() - 120 * 60 * 1000),
                    isRead: false,
                    isUrgent: false,
                },
            ];

            // Save to localStorage immediately
            localStorage.setItem("notifications", JSON.stringify(sampleNotifications));
            return sampleNotifications;
        }
    });

    useEffect(() => {
        if (notifications.length === 0) return;

        const notificationsToStore = notifications.map(n => ({
            ...n,
            timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp,
        }));

        localStorage.setItem("notifications", JSON.stringify(notificationsToStore));
    }, [notifications]);

    const addNotification = (notification: Omit<Notification, "id">) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
        }
        setNotifications(prev => [newNotification, ...prev]);
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter((i => i.id !== id)));
    }

    const updateNotification = (id: string, updates: Partial<Notification>) => {
        setNotifications(prev => prev.map(notification => notification.id === id ? {...notification, ...updates} : notification));
    }

    const markAsRead = (id: string) => {
        updateNotification(id, {isRead: true});
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    }

    const getUnreadCount = () => {
        return notifications.filter(n => !n.isRead).length;
    }

    const getNotificationsByTab = (tab: "all" | "unread" | "urgent") => {
        const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        switch (tab) {
            case "unread":
                return sortedNotifications.filter(n => !n.isRead);
            case "urgent":
                return sortedNotifications.filter(n => n.isUrgent);
            default:
                return sortedNotifications;
        }
    }

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            deleteNotification,
            markAllAsRead,
            markAsRead,
            getUnreadCount,
            getNotificationsByTab,
        }}>{children}</NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
}
