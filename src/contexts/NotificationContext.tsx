import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Notification} from "../types/Notification";
import {generateSampleNotifications} from "../data/mockNotifications";

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
            const sampleNotifications = generateSampleNotifications();

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
