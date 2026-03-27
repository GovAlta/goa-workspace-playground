import { useNavigate } from "react-router-dom";
import {
  GoabxWorkSideMenu,
  GoabxWorkSideMenuItem,
  GoabxWorkSideNotificationPanel,
  GoabxWorkSideNotificationItem,
} from "@abgov/react-components/experimental";

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
            <GoabxWorkSideMenu
              url={`${base}/`}
              heading="Workspace Demo Application"
              userName="Edna Mode"
              userSecondaryText="edna.mode@example.com"
              open={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
              onNavigate={handleNavigate}
              primaryContent={
                <>
                  <GoabxWorkSideMenuItem icon="grid" label="Dashboard" url={`${base}/`} />

                  <GoabxWorkSideMenuItem
                    icon="search"
                    label="Search"
                    url={`${base}/search`}
                  />

                  <GoabxWorkSideMenuItem
                    icon="list"
                    label="Cases"
                    url={`${base}/cases`}
                  />

                  <GoabxWorkSideMenuItem
                    icon="document"
                    label="Documents"
                    type="success"
                    badge="New"
                    url={`${base}/documents`}
                  >
                    <GoabxWorkSideMenuItem
                      label="Sub menu item 1"
                      url={`${base}/documents/sub1`}
                    />
                    <GoabxWorkSideMenuItem
                      label="Sub menu item 2"
                      url={`${base}/documents/sub2`}
                    />
                    <GoabxWorkSideMenuItem
                      label="Sub menu item 3"
                      url={`${base}/documents/sub3`}
                    />
                  </GoabxWorkSideMenuItem>
                </>
              }
              secondaryContent={
                <>
                  <GoabxWorkSideMenuItem
                    icon="notifications"
                    label="Notifications"
                    url="#"
                    badge={unreadCount > 0 ? String(unreadCount) : undefined}
                    type={unreadCount > 0 ? "emergency" : undefined}
                    popoverContent={
                      <GoabxWorkSideNotificationPanel
                        heading="Notifications"
                        activeTab="unread"
                        onMarkAllRead={markAllAsRead}
                        onViewAll={handleViewAll}
                      >
                        {notifications.map((notif) => (
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
                      </GoabxWorkSideNotificationPanel>
                    }
                  />
                </>
              }
              accountContent={
                <>
                  <GoabxWorkSideMenuItem
                    icon="settings"
                    label="Settings"
                    url={`${base}/settings`}
                  />
                  <GoabxWorkSideMenuItem
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
