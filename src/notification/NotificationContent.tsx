import {useState, useRef, useCallback, useEffect} from "react";
import {GoabBadge, GoabIconButton, GoabTab, GoabTabs, GoabText} from "@abgov/react-components";
import {GoaxWorkSideNotificationCard} from "@abgov/react-components/experimental";
import {useNotifications} from "../contexts/NotificationContext";
import {useNavigate} from "react-router-dom";
import {getDateGroupLabel} from "../utils/dateUtils";
import {Notification} from "../types/Notification";

type ScrollPosition = 'at-top' | 'middle' | 'at-bottom' | 'no-scroll';

export const NotificationContent = () => {
    const {getNotificationsByTab, markAsRead, markAllAsRead, markAsUnread, getUnreadCount} = useNotifications();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(1); // Default to "Unread" tab (1-based)
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>('no-scroll');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showUndo, setShowUndo] = useState(false);
    const [undoIds, setUndoIds] = useState<string[]>([]);

    const handleClose = () => {
        // Dispatch close event to parent popover
        scrollRef.current?.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    };

    const checkScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollTop, scrollHeight, clientHeight } = el;
        const hasScroll = scrollHeight > clientHeight;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const threshold = 5;

        if (!hasScroll) {
            setScrollPosition('no-scroll');
        } else if (scrollTop <= threshold) {
            setScrollPosition('at-top');
        } else if (distanceFromBottom <= threshold) {
            setScrollPosition('at-bottom');
        } else {
            setScrollPosition('middle');
        }
    }, []);

    // Run initial scroll check on mount and when tab changes
    useEffect(() => {
        checkScrollState();
    }, [activeTab, checkScrollState]);

    // Reset undo when tab changes
    useEffect(() => {
        setShowUndo(false);
        setUndoIds([]);
    }, [activeTab]);

    const handleScroll = checkScrollState;

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
                            <h4 style={{
                                font: "var(--goa-typography-heading-2xs)",
                                color: "var(--goa-color-greyscale-600)",
                                paddingLeft: "var(--goa-space-m)",
                                marginBottom: 0,
                                paddingBottom: "var(--goa-space-s)",
                                borderBottom: "1px solid var(--goa-color-greyscale-100)"
                            }}>
                                {dateGroup}
                            </h4>
                            {notifications.map(renderNotificationCard)}
                        </div>
                    )
                ))}
            </>);
    }

    const renderNotificationCard = (notification: Notification) => {
        const badge = notification.badgeContent ? (
            <GoabBadge type={notification.badgeType} content={notification.badgeContent} emphasis="subtle"/>
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
                                          urgent={notification.isUrgent}
                                          badge={badge}
                                          onClick={() => handleNotificationClick(notification.id)}></GoaxWorkSideNotificationCard>
        )
    }

    const renderTabContent = () => {
        const unreadCount = getUnreadCount();
        const urgentCount = urgentNotifications.length;

        switch (activeTab) {
            case 1: // Unread
                return unreadCount > 0 ? (
                    renderGroupNotifications(unreadNotifications.slice(0, 25))
                ) : (
                    <div style={{textAlign: "center", padding: "var(--goa-space-xl)"}}>
                        <GoabText size={"body-m"} color={"secondary"}>
                            No unread notifications.
                        </GoabText>
                    </div>
                );
            case 2: // Urgent
                return urgentCount > 0 ? (
                    renderGroupNotifications(urgentNotifications.slice(0, 25))
                ) : (
                    <div style={{textAlign: "center", padding: "var(--goa-space-xl)"}}>
                        <GoabText size={"body-m"} color={"secondary"}>
                            No urgent notifications.
                        </GoabText>
                    </div>
                );
            case 3: // All
                return allNotifications.length > 0 ? (
                    renderGroupNotifications(allNotifications.slice(0, 25))
                ) : (
                    <div style={{textAlign: "center", padding: "var(--goa-space-xl)"}}>
                        <GoabText size={"body-m"} color={"secondary"}>
                            No older notifications to display.
                        </GoabText>
                    </div>
                );
            default:
                return null;
        }
    }

    const unreadCount = getUnreadCount();

    // Determine if shadows should show
    const showHeaderShadow = scrollPosition === 'middle' || scrollPosition === 'at-bottom';
    const showFooterShadow = scrollPosition === 'middle' || scrollPosition === 'at-top';

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "710px"
        }}>
            {/* PINNED TOP: Header + Tabs */}
            <div
                className={`notification-header ${showHeaderShadow ? 'notification-header--shadowed' : ''}`}
                style={{flexShrink: 0}}
            >
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <GoabText size={"heading-s"} ml={"m"} mt={"l"}>
                        Notifications
                    </GoabText>
                    <GoabIconButton
                        icon="close"
                        size="medium"
                        variant="dark"
                        mr="s"
                        onClick={handleClose}
                    />
                </div>
                <GoabTabs
                    initialTab={1}
                    updateUrl={false}
                    ml={"m"}
                    mr={"m"}
                    mb={"none"}
                    onChange={(detail) => setActiveTab(detail.tab)}
                >
                    <GoabTab heading={"Unread"}><></></GoabTab>
                    <GoabTab heading={"Urgent"}><></></GoabTab>
                    <GoabTab heading={"All"}><></></GoabTab>
                </GoabTabs>
            </div>

            {/* SCROLLABLE MIDDLE: Notification content */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{flex: 1, overflow: "auto"}}
            >
                {renderTabContent()}
            </div>

            {/* PINNED BOTTOM: Footer */}
            <div
                className={`notification-footer ${showFooterShadow ? 'notification-footer--shadowed' : ''}`}
                style={{
                    flexShrink: 0,
                    borderTop: "1px solid var(--goa-color-greyscale-100)",
                    padding: "var(--goa-space-m) var(--goa-space-m)"
                }}
            >
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <a href={"#"}
                       className="notification-action-link"
                       onClick={(e) => {
                           e.preventDefault();
                           navigate("/notifications");
                       }}>
                        See all notifications
                    </a>
                    {showUndo ? (
                        <a href={"#"}
                           className="notification-action-link"
                           onClick={(e) => {
                               e.preventDefault();
                               handleUndo();
                           }}>
                            Undo
                        </a>
                    ) : (
                        <a href={"#"}
                           className="notification-action-link"
                           tabIndex={unreadCount === 0 ? -1 : 0}
                           aria-disabled={unreadCount === 0}
                           style={{
                               opacity: unreadCount === 0 ? 0.5 : 1,
                               cursor: unreadCount === 0 ? "not-allowed" : "pointer",
                               pointerEvents: unreadCount === 0 ? "none" : "auto",
                           }}
                           onClick={(e) => {
                               e.preventDefault();
                               handleMarkAllAsRead();
                           }}>
                            Mark all as read ({unreadCount})
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
