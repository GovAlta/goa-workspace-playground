import { useNavigate } from "react-router-dom";
import {
  GoabWorkSideMenu,
  GoabWorkSideMenuItem,
  GoabWorkSideNotificationPanel,
  GoabWorkSideNotificationItem,
} from "@abgov/react-components";

import { MenuContext } from "./contexts/MenuContext";
import { PageFooterProvider } from "./contexts/PageFooterContext";
import { ScrollStateProvider } from "./contexts/ScrollStateContext";
import { NotificationProvider, useNotifications } from "./contexts/NotificationContext";
import { WorkspaceLayout } from "./components/WorkspaceLayout";
import { useWorkspaceMenuState } from "./hooks/useWorkspaceMenuState";

function AppShell() {
  const navigate = useNavigate();
  const { menuOpen, setMenuOpen, isMobile } = useWorkspaceMenuState();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const handleNavigate = (path: string) => {
    const routePath = base ? path.replace(base, "") || "/" : path;
    navigate(routePath);
  };

  const handleViewAll = () => {
    navigate("/notifications");
  };

  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen, isMobile }}>
      <PageFooterProvider>
        <ScrollStateProvider>
          <div className="app-layout">
            <GoabWorkSideMenu
              url={`${base}/`}
              heading="Workspace Demo Application"
              userName="Edna Mode"
              userSecondaryText="edna.mode@example.com"
              open={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
              onNavigate={handleNavigate}
              primaryContent={
                <>
                  <GoabWorkSideMenuItem icon="grid" label="Dashboard" url={`${base}/`} />

                  <GoabWorkSideMenuItem
                    icon="search"
                    label="Search"
                    url={`${base}/search`}
                  />

                  <GoabWorkSideMenuItem
                    icon="list"
                    label="Cases"
                    url={`${base}/cases`}
                  />

                  <GoabWorkSideMenuItem
                    icon="document"
                    label="Documents"
                    type="success"
                    badge="New"
                    url={`${base}/documents`}
                  >
                    <GoabWorkSideMenuItem
                      label="Sub menu item 1"
                      url={`${base}/documents/sub1`}
                    />
                    <GoabWorkSideMenuItem
                      label="Sub menu item 2"
                      url={`${base}/documents/sub2`}
                    />
                    <GoabWorkSideMenuItem
                      label="Sub menu item 3"
                      url={`${base}/documents/sub3`}
                    />
                  </GoabWorkSideMenuItem>
                </>
              }
              secondaryContent={
                <>
                  <GoabWorkSideMenuItem
                    icon="notifications"
                    label="Notifications"
                    url="#"
                    badge={unreadCount > 0 ? String(unreadCount) : undefined}
                    type={unreadCount > 0 ? "emergency" : undefined}
                    popoverContent={
                      <GoabWorkSideNotificationPanel
                        heading="Notifications"
                        activeTab="unread"
                        onMarkAllRead={markAllAsRead}
                        onViewAll={handleViewAll}
                      >
                        {notifications.map((notif) => (
                          <GoabWorkSideNotificationItem
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
                      </GoabWorkSideNotificationPanel>
                    }
                  />
                </>
              }
              accountContent={
                <>
                  <GoabWorkSideMenuItem
                    icon="settings"
                    label="Settings"
                    url={`${base}/settings`}
                  />
                  <GoabWorkSideMenuItem
                    icon="log-out"
                    label="Log out"
                    url={`${base}/logout`}
                  />
                </>
              }
            />

            <WorkspaceLayout />
            <div id="page-push-drawer-portal" />
          </div>
        </ScrollStateProvider>
      </PageFooterProvider>
    </MenuContext.Provider>
  );
}

export function App() {
  return (
    <NotificationProvider>
      <AppShell />
    </NotificationProvider>
  );
}

export default App;
