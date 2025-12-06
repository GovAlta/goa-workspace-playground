import React, {useState, useMemo, useEffect} from "react";
import {
    GoabText,
    GoabBadge,
    GoabTabs,
    GoabTab,
    GoabButton,
} from "@abgov/react-components";
import {useNotifications} from "../contexts/NotificationContext";
import {usePageHeader} from "../contexts/PageHeaderContext";
import {getDateGroupLabel} from "../utils/dateUtils";
import {Notification} from "../types/Notification";
import {GoaxWorkSideNotificationCard} from "@abgov/react-components/experimental";
import emptyStateIllustration from "../assets/empty-state-illustration.svg";

export function NotificationsPage() {
    const {getNotificationsByTab, markAsRead, markAllAsRead, markAsUnread, getUnreadCount} = useNotifications();

    const [activeTab, setActiveTab] = useState(1);
    const [showUndo, setShowUndo] = useState(false);
    const [undoIds, setUndoIds] = useState<string[]>([]);

    const allNotifications = getNotificationsByTab("all");
    const unreadNotifications = getNotificationsByTab("unread");
    const urgentNotifications = getNotificationsByTab("urgent");

    const unreadCount = getUnreadCount();

    // Reset undo when tab changes
    useEffect(() => {
        setShowUndo(false);
        setUndoIds([]);
    }, [activeTab]);

    const handleMarkAllAsRead = () => {
        const ids = markAllAsRead();
        if (ids.length > 0) {
            setUndoIds(ids);
            setShowUndo(true);
        }
    };

    const handleUndo = () => {
        markAsUnread(undoIds);
        setShowUndo(false);
        setUndoIds([]);
    };

    const handleNotificationClick = (id: string) => {
        markAsRead(id);
        setShowUndo(false);
        setUndoIds([]);
    };

    // Header actions
    const headerActions = useMemo(() => (
        showUndo ? (
            <GoabButton
                type="tertiary"
                size="compact"
                onClick={handleUndo}
            >
                Undo
            </GoabButton>
        ) : (
            <GoabButton
                type="tertiary"
                size="compact"
                disabled={unreadCount === 0}
                onClick={handleMarkAllAsRead}
            >
                Mark all as read
            </GoabButton>
        )
    ), [showUndo, unreadCount]);

    // Header tabs
    const headerTabs = useMemo(() => (
        <GoabTabs
            initialTab={1}
            updateUrl={false}
            mb="none"
            stackOnMobile={false}
            onChange={(detail) => setActiveTab(detail.tab)}
        >
            <GoabTab heading={<>Unread {unreadCount > 0 && <GoabBadge type="default" content={`${unreadCount}`} emphasis="subtle" version="2" />}</>}><></></GoabTab>
            <GoabTab heading={<>Urgent {urgentNotifications.filter(n => !n.isRead).length > 0 && <GoabBadge type="important" content={`${urgentNotifications.filter(n => !n.isRead).length}`} emphasis="subtle" version="2" />}</>}><></></GoabTab>
            <GoabTab heading="All"><></></GoabTab>
        </GoabTabs>
    ), [unreadCount, urgentNotifications.length]);

    usePageHeader("All Notifications", { actions: headerActions, tabs: headerTabs });

    const groupNotificationsByDate = (notifications: Notification[]) => {
        const groups: { [key: string]: Notification[] } = {};
        notifications.forEach(notification => {
            const groupLabel = getDateGroupLabel(notification.timestamp);
            if (!groups[groupLabel]) {
                groups[groupLabel] = [];
            }
            groups[groupLabel].push(notification);
        });

        const orderedGroups: { [key: string]: Notification[] } = {};
        if (groups["Today"]) orderedGroups["Today"] = groups["Today"];
        if (groups["Yesterday"]) orderedGroups["Yesterday"] = groups["Yesterday"];

        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        weekdays.forEach(day => {
            if (groups[day]) orderedGroups[day] = groups[day];
        });

        const fullDateGroups = Object.keys(groups).filter(
            key => !["Today", "Yesterday", ...weekdays].includes(key)
        );
        fullDateGroups.forEach(dateGroup => {
            orderedGroups[dateGroup] = groups[dateGroup];
        });

        return orderedGroups;
    };

    const renderNotificationCard = (notification: Notification) => {
        const badge = notification.badgeContent ? (
            <GoabBadge type={notification.badgeType} content={notification.badgeContent} emphasis="subtle"/>
        ) : undefined;

        return (
            <GoaxWorkSideNotificationCard
                id={notification.id}
                key={notification.id}
                type={notification.type}
                title={notification.title}
                description={notification.description}
                timestamp={notification.timestamp}
                unread={!notification.isRead}
                urgent={notification.isUrgent}
                badge={badge}
                onClick={() => handleNotificationClick(notification.id)}
            />
        );
    };

    const renderGroupedNotifications = (notifications: Notification[]) => {
        const grouped = groupNotificationsByDate(notifications);
        return (
            <>
                {Object.entries(grouped).map(([dateGroup, groupNotifications]) => (
                    groupNotifications.length > 0 && (
                        <div key={dateGroup}>
                            <h4 style={{
                                font: "var(--goa-typography-heading-2xs)",
                                color: "var(--goa-color-greyscale-600)",
                                paddingLeft: "var(--goa-space-m)",
                                paddingRight: "var(--goa-space-m)",
                                marginTop: "var(--goa-space-l)",
                                marginBottom: 0,
                                paddingBottom: "var(--goa-space-s)",
                                borderBottom: "1px solid var(--goa-color-greyscale-100)"
                            }}>
                                {dateGroup}
                            </h4>
                            {groupNotifications.map(renderNotificationCard)}
                        </div>
                    )
                ))}
            </>
        );
    };

    const renderEmptyState = (heading: string, subline: string) => (
        <div className="notification-empty-state">
            <img src={emptyStateIllustration} alt="" className="notification-empty-state__illustration" />
            <span className="notification-empty-state__heading">{heading}</span>
            <span className="notification-empty-state__subline">{subline}</span>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 1:
                return unreadNotifications.length > 0
                    ? renderGroupedNotifications(unreadNotifications)
                    : renderEmptyState("You're all caught up", "No unread notifications");
            case 2:
                return urgentNotifications.length > 0
                    ? renderGroupedNotifications(urgentNotifications)
                    : renderEmptyState("No urgent notifications", "Nothing requires your immediate attention");
            case 3:
                return allNotifications.length > 0
                    ? renderGroupedNotifications(allNotifications)
                    : renderEmptyState("No notifications", "You don't have any notifications yet");
            default:
                return null;
        }
    };

    return (
        <div style={{padding: "16px var(--goa-space-xl) var(--goa-space-xl) var(--goa-space-xl)"}}>
            <div
                className="notifications-page-content"
                style={{
                    border: "1px solid #e7e7e7",
                    borderRadius: "16px",
                    overflow: "hidden"
                }}
            >
                {renderTabContent()}
            </div>
        </div>
    );
}
