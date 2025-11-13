import {useMemo} from "react";
import {GoabBadge, GoabButtonGroup, GoabLink, GoabTab, GoabTabs, GoabText} from "@abgov/react-components";
import {GoaxWorkSideNotificationCard, WorkSideNotificationType} from "@abgov/react-components/experimental";
import {useNotifications} from "../contexts/NotificationContext";
import {useNavigate} from "react-router-dom";
import {getDateGroupLabel, isToday, isYesterday} from "../utils/dateUtils";
import {Notification} from "../types/Notification";

export const NotificationContent = () => {
    const {getNotificationsByTab, markAsRead, markAllAsRead, getUnreadCount} = useNotifications();
    const navigate = useNavigate();

    const allNotifications = getNotificationsByTab("all");
    const unreadNotifications = getNotificationsByTab("unread");
    const urgentNotifications = getNotificationsByTab("urgent");

    const groupNotificationsByDate = (notifications: Notification[]) => {
        const groups: { [key: string]: Notification[] } = {};
        notifications.forEach((notification => {
            const groupLabel = getDateGroupLabel(notification.timestamp);
            if (!groups[groupLabel]) {
                groups[groupLabel] = [];
            }
            groups[groupLabel].push(notification);
        }));
        const orderedGroups: { [key: string]: Notification[] } = {};
        if (groups["Today"]) {
            orderedGroups["Today"] = groups["Today"];
        }
        if (groups["Yesterday"]) {
            orderedGroups["Yesterday"] = groups["Yesterday"];
        }
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        weekdays.forEach(day => {
            if (groups[day]) {
                orderedGroups[day] = groups[day];
            }
        });
        const fullDateGroups = Object.keys(groups).filter(key => !["Today", "Yesterday", ...weekdays].includes(key));
        fullDateGroups.forEach(dateGroup => {
            orderedGroups[dateGroup] = groups[dateGroup];
        })
        return orderedGroups;
    }

    const renderGroupNotifications = (notifications: Notification[]) => {
        const grouped = groupNotificationsByDate(notifications);
        return (
            <>
                {Object.entries(grouped).map(([dateGroup, notifications]) => (
                    notifications.length > 0 && (
                        <div key={dateGroup}>
                            <GoabText tag={"h4"} size={"heading-s"} color={"secondary"} ml={"m"}>
                                {dateGroup}
                            </GoabText>
                            {notifications.map(renderNotificationCard)}
                        </div>
                    )
                ))}
            </>);
    }

    const renderNotificationCard = (notification: Notification) => {
        const badge = notification.badgeContent ? (
            <GoabBadge type={notification.badgeType} content={notification.badgeContent}/>
        ) : undefined;
        const truncatedTitle = notification.title.length > 100 ? `${notification.title.substring(0, 100)}...` : notification.title;
        const truncatedDescription = notification.description.length > 100 ? `${notification.description.substring(0, 100)}...` : notification.description;

        return (
            <GoaxWorkSideNotificationCard id={notification.id}
                                          key={notification.id}
                                          type={notification.type}
                                          title={truncatedTitle}
                                          description={truncatedDescription}
                                          timestamp={notification.timestamp}
                                          unread={!notification.isRead}
                                          badge={badge}
                                          onClick={() => markAsRead(notification.id)}></GoaxWorkSideNotificationCard>
        )
    }

    const unreadCount = getUnreadCount();
    const urgentCount = urgentNotifications.length;

    return (
        <div style={{height: "710px", paddingBottom: "2rem", overflow: "scroll"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <GoabText tag={"h1"} size={"heading-m"} ml={"m"}>
                    Notifications
                </GoabText>
                <GoabLink mt={"l"} mr={"m"}><a href={"#"}
                                               tabIndex={unreadCount === 0 ? -1 : 0}
                                               aria-disabled={unreadCount === 0}
                                               style={{
                                                   opacity: unreadCount === 0 ? 0.5 : 1,
                                                   cursor: unreadCount === 0 ? "not-allowed" : "pointer",
                                                   pointerEvents: unreadCount === 0 ? "none" : "auto",
                                               }}
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   markAllAsRead();
                                               }}>
                    Mark all as read
                </a></GoabLink>
            </div>
            <GoabTabs initialTab={1} updateUrl={false} ml={"m"}>
                <GoabTab heading={"All"}>
                    {allNotifications.length > 0 ? (
                        renderGroupNotifications(allNotifications.slice(0, 25))) : (
                        <div style={{textAlign: "center"}}>
                            <GoabText size={"body-m"} color={"secondary"}>
                                No older notifications to display.
                            </GoabText>
                        </div>
                    )}
                    {allNotifications.length > 25 && (
                        <GoabButtonGroup alignment={"center"} mt={"l"}>
                            <GoabLink action={"close"}>
                                <a href={"#"} onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/notifications");
                                }}>
                                    See all notifications
                                </a>
                            </GoabLink>
                        </GoabButtonGroup>
                    )}
                </GoabTab>

                <GoabTab heading={"Unread"}>
                    {unreadCount > 0 ? (
                            renderGroupNotifications(unreadNotifications.slice(0, 25))) :
                        <div style={{textAlign: "center"}}>
                            <GoabText size={"body-m"} color={"secondary"}>
                                No unread notifications.
                            </GoabText>
                        </div>}
                    {unreadCount > 25 && (
                        <GoabButtonGroup alignment={"center"} mt={"l"}>
                            <GoabLink action={"close"}>
                                <a href={"#"} onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/notifications#tab-1");
                                }}>
                                    See all notifications
                                </a>
                            </GoabLink>
                        </GoabButtonGroup>
                    )}
                </GoabTab>

                <GoabTab heading={"Urgent"}>
                    {urgentCount > 0 ? (
                            renderGroupNotifications(urgentNotifications.slice(0, 25))) :
                        <div style={{textAlign: "center"}}>
                            <GoabText size={"body-m"} color={"secondary"}>
                                No urgent notifications.
                            </GoabText>
                        </div>}
                    {urgentCount > 25 && (
                        <GoabButtonGroup alignment={"center"}>
                            <GoabLink action={"close"}>
                                <a href={"#"} onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/notifications#tab-2");
                                }}>
                                    See all notifications
                                </a>
                            </GoabLink>
                        </GoabButtonGroup>
                    )}
                </GoabTab>
            </GoabTabs>
        </div>
    )
}
