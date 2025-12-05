import {useState, useRef, useCallback, useEffect} from "react";
import {GoabIconButton, GoabTab, GoabTabs, GoabText} from "@abgov/react-components";
import {useNotifications} from "../contexts/NotificationContext";
import {useNavigate} from "react-router-dom";
import {Notification} from "../types/Notification";
import {MOBILE_BREAKPOINT} from "../constants/breakpoints";
import {groupNotificationsByDate, MAX_NOTIFICATIONS} from "./utils";
import {EmptyState} from "./EmptyState";
import {DateGroupHeader} from "./DateGroupHeader";
import {NotificationCard} from "./NotificationCard";

type ScrollPosition = 'at-top' | 'middle' | 'at-bottom' | 'no-scroll';

export const NotificationContent = () => {
    const {getNotificationsByTab, markAsRead, markAllAsRead, markAsUnread, getUnreadCount} = useNotifications();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState(1);
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>('no-scroll');
    const [showUndo, setShowUndo] = useState(false);
    const [undoIds, setUndoIds] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

    const unreadCount = getUnreadCount();
    const allNotifications = getNotificationsByTab("all");
    const unreadNotifications = getNotificationsByTab("unread");
    const urgentNotifications = getNotificationsByTab("urgent");

    // Track mobile state
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check scroll position
    const checkScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const {scrollTop, scrollHeight, clientHeight} = el;
        const hasScroll = scrollHeight > clientHeight;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const threshold = 5;

        if (!hasScroll) setScrollPosition('no-scroll');
        else if (scrollTop <= threshold) setScrollPosition('at-top');
        else if (distanceFromBottom <= threshold) setScrollPosition('at-bottom');
        else setScrollPosition('middle');
    }, []);

    useEffect(() => {
        checkScrollState();
    }, [activeTab, checkScrollState]);

    // Reset undo state when tab changes
    useEffect(() => {
        setShowUndo(false);
        setUndoIds([]);
    }, [activeTab]);

    // Event handlers
    const handleClose = () => {
        scrollRef.current?.dispatchEvent(new CustomEvent('close', {bubbles: true}));
    };

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

    const renderGroupedNotifications = (notifications: Notification[]) => {
        const grouped = groupNotificationsByDate(notifications);
        return (
            <>
                {Object.entries(grouped).map(([dateGroup, items]) => (
                    items.length > 0 && (
                        <div key={dateGroup}>
                            <DateGroupHeader label={dateGroup}/>
                            {items.map(notification => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                />
                            ))}
                        </div>
                    )
                ))}
            </>
        );
    };

    const getTabContent = () => {
        const tabConfig = {
            1: {notifications: unreadNotifications, emptyMessage: "No unread notifications."},
            2: {notifications: urgentNotifications, emptyMessage: "No urgent notifications."},
            3: {notifications: allNotifications, emptyMessage: "No older notifications to display."},
        };

        const config = tabConfig[activeTab as keyof typeof tabConfig];
        if (!config) return null;

        return config.notifications.length > 0
            ? renderGroupedNotifications(config.notifications.slice(0, MAX_NOTIFICATIONS))
            : <EmptyState message={config.emptyMessage}/>;
    };

    const showHeaderShadow = scrollPosition === 'middle' || scrollPosition === 'at-bottom';
    const showFooterShadow = scrollPosition === 'middle' || scrollPosition === 'at-top';

    const renderTabs = (stackOnMobile: boolean = true) => (
        <GoabTabs
            initialTab={1}
            updateUrl={false}
            mb="none"
            stackOnMobile={stackOnMobile}
            onChange={(detail) => setActiveTab(detail.tab)}
            {...(!isMobile && {ml: "m", mr: "m"})}
        >
            <GoabTab heading="Unread"><></></GoabTab>
            <GoabTab heading="Urgent"><></></GoabTab>
            <GoabTab heading="All"><></></GoabTab>
        </GoabTabs>
    );

    const renderFooter = () => (
        <div
            className={`notification-footer ${showFooterShadow ? 'notification-footer--shadowed' : ''}`}
            style={{
                flexShrink: 0,
                borderTop: "1px solid var(--goa-color-greyscale-100)",
                padding: "var(--goa-space-m)"
            }}
        >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <a
                    href="#"
                    className="notification-action-link"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/notifications");
                    }}
                >
                    See all notifications
                </a>
                {showUndo ? (
                    <a
                        href="#"
                        className="notification-action-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleUndo();
                        }}
                    >
                        Undo
                    </a>
                ) : (
                    <a
                        href="#"
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
                        }}
                    >
                        Mark all as read ({unreadCount})
                    </a>
                )}
            </div>
        </div>
    );

    const renderScrollableContent = () => (
        <div
            ref={scrollRef}
            onScroll={checkScrollState}
            style={{flex: 1, overflow: "auto"}}
        >
            {getTabContent()}
        </div>
    );

    return (
        <div
            className={isMobile ? "notification-drawer-content" : undefined}
            style={{
                display: "flex",
                flexDirection: "column",
                ...(isMobile
                    ? {
                        height: "calc(80vh - 60px)",
                        maxHeight: "calc(80vh - 60px)",
                        margin: "calc(-1 * var(--goa-space-l)) calc(-1 * var(--goa-space-xl))",
                    }
                    : {
                        height: "710px",
                    }
                ),
            }}
        >
            {/* Header */}
            <div
                className={`notification-header ${showHeaderShadow ? 'notification-header--shadowed' : ''}`}
                style={{
                    flexShrink: 0,
                    ...(isMobile ? {padding: "0 var(--goa-space-m)"} : {}),
                }}
            >
                {/* Desktop only: heading and close button (on mobile, drawer provides these) */}
                {!isMobile && (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <GoabText size="heading-s" ml="m" mt="l">Notifications</GoabText>
                        <GoabIconButton
                            icon="close"
                            size="medium"
                            variant="dark"
                            mr="s"
                            onClick={handleClose}
                        />
                    </div>
                )}
                {renderTabs(!isMobile)}
            </div>
            {renderScrollableContent()}
            {renderFooter()}
        </div>
    );
};
