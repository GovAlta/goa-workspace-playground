import {WorkSideNotificationType} from "@abgov/react-components/experimental";
import {GoabBadgeType} from "@abgov/ui-components-common";

export interface Notification {
    id: string;
    type: WorkSideNotificationType;
    title: string;
    description: string;
    timestamp: Date;
    isRead: boolean;
    isUrgent: boolean;
    badgeType?: GoabBadgeType;
    badgeContent?: string;
}

export type NotificationTab = "all" | "unread" | "urgent";

export interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
}
