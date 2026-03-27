import { useState, useMemo } from "react";
import { GoabTab } from "@abgov/react-components";
import {
  GoabxTabs,
  GoabxBadge,
  GoabxButton,
  GoabxWorkSideNotificationItem,
} from "@abgov/react-components/experimental";
import { GoabTabsOnChangeDetail } from "@abgov/ui-components-common";
import { PageHeader } from "../../components/PageHeader";
import {
  useNotifications,
  type Notification,
} from "../../contexts/NotificationContext";
import "./NotificationsPage.css";

type TabSlug = "unread" | "urgent" | "all";
const TAB_SLUGS: TabSlug[] = ["unread", "urgent", "all"];

function groupByDate(items: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const map = new Map<string, Notification[]>();

  for (const item of items) {
    const d = new Date(item.timestamp);
    const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let key: string;
    if (itemDate.getTime() === today.getTime()) {
      key = "Today";
    } else if (itemDate.getTime() === yesterday.getTime()) {
      key = "Yesterday";
    } else {
      key = itemDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  }

  for (const [label, items] of map) {
    groups.push({ label, items });
  }

  return groups;
}

export function NotificationsPage() {
  const { notifications, unreadCount, urgentCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<TabSlug>("unread");

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => n.readStatus === "unread");
      case "urgent":
        return notifications.filter((n) => n.priority === "urgent");
      case "all":
        return notifications;
    }
  }, [notifications, activeTab]);

  const groups = useMemo(
    () => groupByDate(filteredNotifications),
    [filteredNotifications],
  );

  const handleTabChange = (detail: GoabTabsOnChangeDetail) => {
    const slug = TAB_SLUGS[detail.tab - 1];
    if (slug) {
      setActiveTab(slug);
    }
  };

  const tabIndex = TAB_SLUGS.indexOf(activeTab) + 1;

  return (
    <>
      <PageHeader
        title="All Notifications"
        actions={
          unreadCount > 0 ? (
            <GoabxButton type="tertiary" size="compact" onClick={markAllAsRead}>
              Mark all as read
            </GoabxButton>
          ) : undefined
        }
        tabs={
          <GoabxTabs
            initialTab={tabIndex}
            onChange={handleTabChange}
            variant="segmented"
          >
            <GoabTab
              slug="unread"
              heading={
                <>
                  Unread{" "}
                  {unreadCount > 0 && (
                    <GoabxBadge type="default" emphasis="subtle" content={String(unreadCount)} />
                  )}
                </>
              }
            />
            <GoabTab
              slug="urgent"
              heading={
                <>
                  Urgent{" "}
                  {urgentCount > 0 && (
                    <GoabxBadge type="important" emphasis="subtle" content={String(urgentCount)} />
                  )}
                </>
              }
            />
            <GoabTab slug="all" heading="All" />
          </GoabxTabs>
        }
      />

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <p>No notifications to show.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="notifications-group">
              <h4 className="notifications-group__heading">{group.label}</h4>
              <div className="notifications-group__items">
                {group.items.map((notif) => (
                  <GoabxWorkSideNotificationItem
                    key={notif.id}
                    title={notif.title}
                    description={notif.description}
                    timestamp={notif.timestamp}
                    type={notif.type}
                    readStatus={notif.readStatus}
                    priority={notif.priority}
                    onClick={() => markAsRead(notif.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
