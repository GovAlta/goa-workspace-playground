import {GoabBadge} from "@abgov/react-components";
import {GoaxWorkSideNotificationCard} from "@abgov/react-components/experimental";
import {Notification} from "../types/Notification";
import {truncateText} from "./utils";

interface NotificationCardProps {
    notification: Notification;
    onClick: (id: string) => void;
}

export const NotificationCard = ({notification, onClick}: NotificationCardProps) => {
    const badge = notification.badgeContent ? (
        <GoabBadge type={notification.badgeType} content={notification.badgeContent} emphasis="subtle"/>
    ) : undefined;

    return (
        <GoaxWorkSideNotificationCard
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={truncateText(notification.title)}
            description={truncateText(notification.description)}
            timestamp={notification.timestamp}
            unread={!notification.isRead}
            urgent={notification.isUrgent}
            badge={badge}
            onClick={() => onClick(notification.id)}
        />
    );
};
