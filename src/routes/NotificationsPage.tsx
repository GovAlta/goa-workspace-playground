import React from "react";
import {
    GoabText,
    GoabPageBlock,
    GoabBadge,
    GoabTabs,
    GoabTab,
    GoabLink, GoabIconButton, GoabButtonGroup
} from "@abgov/react-components";
import {useNotifications} from "../contexts/NotificationContext";
import {PageHeader} from "../components/PageHeader";
import {isToday, isYesterday} from "../utils/dateUtils";
import {Notification} from "../types/Notification";
import {GoaxWorkSideNotificationCard} from "@abgov/react-components/experimental";

export function NotificationsPage() {
    const {getNotificationsByTab, markAsRead, markAllAsRead, getUnreadCount} = useNotifications();

    const allNotifications = getNotificationsByTab("all");
    const unreadNotifications = getNotificationsByTab("unread");
    const urgentNotifications = getNotificationsByTab("urgent");

    const unreadCount = getUnreadCount();
    const urgentCount = urgentNotifications.length;

    const groupNotificationsByDate = (notifications: Notification[]) => {
        const groups: { [key: string]: Notification[] } = {
            "Today": [],
            "Yesterday": [],
            "Older": []
        };
        notifications.forEach(notification => {
            if (isToday(notification.timestamp)) {
                groups["Today"].push(notification);
            } else if (isYesterday(notification.timestamp)) {
                groups["Yesterday"].push(notification);
            } else {
                groups["Older"].push(notification);
            }
        });
        return groups;
    }

    const renderNotificationCard = (notification: Notification) => {
        const badge = notification.badgeContent ? (
            <GoabBadge type={notification.badgeType} content={notification.badgeContent}></GoabBadge>
        ) : undefined;
        return (
            <GoaxWorkSideNotificationCard id={notification.id}
                                          key={notification.id}
                                          type={notification.type}
                                          title={notification.title}
                                          description={notification.description}
                                          timestamp={notification.timestamp}
                                          unread={!notification.isRead}
                                          badge={badge}
                                          onClick={() => markAsRead(notification.id)}></GoaxWorkSideNotificationCard>
        );
    }

    const renderGroupedNotifications = (notifications: Notification[]) => {
        const grouped = groupNotificationsByDate(notifications);
        return (
            <>
                {Object.entries(grouped).map(([dateGroup, notifications]) => (
                    <div key={dateGroup}>
                        <GoabText tag={"h3"} size={"heading-s"} color={"secondary"} mb={"m"} ml={"l"}>
                            {dateGroup}
                        </GoabText>
                        {notifications.map((notification: Notification) => renderNotificationCard(notification))}
                    </div>
                ))}
            </>
        )
    }

    const renderNoNotifications = () => {
        return (
            <div style={{textAlign: "center"}}>
                <GoabText size={"body-m"} color={"secondary"}>
                    No notifications to display
                </GoabText>
            </div>
        )
    }

    return (
        <GoabPageBlock width={"full"}>
            <PageHeader title={"All Notifications"}  actions={
                <GoabButtonGroup alignment={"start"}>
                    {unreadCount > 0 && <GoabLink>
                        <a href={"#"} onClick={(e) => {
                            e.preventDefault();
                            markAllAsRead();
                        }}>Mark all as read</a>
                    </GoabLink>}
                    <GoabIconButton icon={"filter"} onClick={() => console.log("click")}></GoabIconButton>
                </GoabButtonGroup>}></PageHeader>

            <GoabTabs initialTab={1}>
                <GoabTab heading={"All"}>
                    {allNotifications.length > 0 ?
                        renderGroupedNotifications(allNotifications) :
                        renderNoNotifications()}
                </GoabTab>

                <GoabTab heading={
                    <>
                        Unread
                        {unreadCount > 0 ?
                            <GoabBadge type={"information"} content={`${unreadCount}`}/> : null}
                    </>
                }>
                    {unreadNotifications.length > 0 ? renderGroupedNotifications(unreadNotifications) : renderNoNotifications()}
                </GoabTab>

                <GoabTab heading={
                    <>
                        Urgent
                        {urgentCount > 0 ?
                            <GoabBadge type={"important"} content={`${urgentCount}`}/> : null}
                    </>
                }>
                    {urgentCount > 0 ? renderGroupedNotifications(urgentNotifications) : renderNoNotifications()}
                </GoabTab>

            </GoabTabs>
        </GoabPageBlock>
    );
}
