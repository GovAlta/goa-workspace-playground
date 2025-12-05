import {Notification} from "../types/Notification";
import {getDateGroupLabel} from "../utils/dateUtils";

export const MAX_NOTIFICATIONS = 25;
export const MAX_TEXT_LENGTH = 100;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const truncateText = (text: string, maxLength: number = MAX_TEXT_LENGTH): string =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

export const groupNotificationsByDate = (notifications: Notification[]): Record<string, Notification[]> => {
    const groups: Record<string, Notification[]> = {};

    notifications.forEach(notification => {
        const groupLabel = getDateGroupLabel(notification.timestamp);
        if (!groups[groupLabel]) {
            groups[groupLabel] = [];
        }
        groups[groupLabel].push(notification);
    });

    // Order: Today, Yesterday, Weekdays, then full dates
    const orderedGroups: Record<string, Notification[]> = {};
    const specialDays = ["Today", "Yesterday"];

    [...specialDays, ...WEEKDAYS].forEach(day => {
        if (groups[day]) {
            orderedGroups[day] = groups[day];
        }
    });

    // Add remaining date groups
    Object.keys(groups)
        .filter(key => ![...specialDays, ...WEEKDAYS].includes(key))
        .forEach(dateGroup => {
            orderedGroups[dateGroup] = groups[dateGroup];
        });

    return orderedGroups;
};
