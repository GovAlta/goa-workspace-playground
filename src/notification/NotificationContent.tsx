import { useState } from "react";
import { GoabBadge, GoabButtonGroup, GoabLink, GoabTab, GoabTabs, GoabText } from "@abgov/react-components";
import { GoaxWorkSideNotificationCard, WorkSideNotificationType } from "@abgov/react-components/experimental";

export const NotificationContent = () => {
    const [notifications] = useState([
        {
            id: "1",
            type: "default",
            title: "Comments",
            description: "Harvey Don commented on your assigned case.",
            timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        },
        {
            id: "2",
            type: "default",
            title: "Assignment",
            description: "Rita Lee assigned you a new case.",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            badge: <GoabBadge type={"success"} content={"New"} />,
        },
        {
            id: "3",
            type: "warning" as const,
            title: "Incoming outage",
            description:
                "Income and Employment Support (IES) service will be under maintenance from Thursday, September 15, 2024 at 10pm to Friday, September 16,2024 at 10am.",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            badge: <GoabBadge type="important" content={"Outage"} />,
        },
    ]);

    const [yesterdayNotifications] = useState([
        {
            id: "4",
            type: "info",
            title: "Application update",
            description: "Gilbert Barton's application for income support was approved.",
            timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago (yesterday morning),
            badge: <GoabBadge type={"success"} content={"Approved"} />,
        },
    ]);

    return (
        <>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <GoabText tag={"h1"} size={"heading-m"} ml={"m"}>
                    Notifications
                </GoabText>
                <GoabLink mt={"l"} mr={"m"}><a href={"#"}>Mark all as read</a></GoabLink>

            </div>
            <GoabTabs>
                <GoabTab heading={"All"}>
                    <GoabText tag={"h4"} size={"heading-s"} color={"secondary"} ml={"m"}>Today</GoabText>
                    {notifications.map((notif) => (
                        <GoaxWorkSideNotificationCard
                            id={notif.id}
                            key={notif.id}
                            type={notif.type as WorkSideNotificationType}
                            title={notif.title}
                            description={notif.description}
                            timestamp={notif.timestamp}
                            badge={notif.badge}
                            onClick={() => console.log("Notification clicked", notif.id)}
                        />
                    ))}
                    <GoabText tag={"h4"} size={"heading-s"} color={"secondary"} ml={"m"}>Yesterday</GoabText>
                    {yesterdayNotifications.map((notif) => (
                        <GoaxWorkSideNotificationCard
                            id={notif.id}
                            key={notif.id}
                            type={notif.type as WorkSideNotificationType}
                            title={notif.title}
                            description={notif.description}
                            timestamp={notif.timestamp}
                            badge={notif.badge}
                            onClick={() => console.log("Notification clicked", notif.id)}
                        />
                    ))}
                    <GoabButtonGroup alignment={"center"} mb={"xl"} mt={"l"}>
                        <GoabLink>See all notifications</GoabLink>
                    </GoabButtonGroup>
                </GoabTab>
                <GoabTab heading={"Unread"}>

                </GoabTab>
                <GoabTab heading={"Urgent"}>

                </GoabTab>
            </GoabTabs>
        </>
    )
}
