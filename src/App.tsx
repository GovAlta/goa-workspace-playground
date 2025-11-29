import {
  GoabxWorkSideMenu,
  GoabxWorkSideMenuItem
} from "@abgov/react-components/experimental";

import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuContext, useMenu } from './contexts/MenuContext';
import { PageHeaderProvider } from './contexts/PageHeaderContext';
import { ScrollStateProvider, useScrollState } from './contexts/ScrollStateContext';
import { PageHeader } from './components/PageHeader';
import {NotificationContent} from "./notification/NotificationContent";
import { useNotifications } from "./contexts/NotificationContext";
import { MOBILE_BREAKPOINT } from "./constants/breakpoints";

// Inner component that can use ScrollState context
function WorkspaceContent() {
  const { isMobile } = useMenu();
  const { scrollPosition } = useScrollState();

  if (isMobile) {
    // Mobile: No adaptive chrome, content edge-to-edge
    return (
      <div
        className="mobile-content-container"
        style={{
          backgroundColor: "white",
          height: "100%",
          overflow: "auto"
        }}
      >
        <PageHeader />
        <Outlet />
      </div>
    );
  }

  // Desktop: Card container with adaptive chrome based on scroll state
  return (
    <div
      className="desktop-card-container"
      data-scroll-state={scrollPosition}
    >
      <PageHeader />
      <Outlet />
    </div>
  );
}

export function App() {
  const navigate = useNavigate();

  // On mobile (< MOBILE_BREAKPOINT), start with menu closed; on desktop, start with menu open
  const [menuOpen, setMenuOpen] = useState(window.innerWidth >= MOBILE_BREAKPOINT);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const { getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

  // Navigate and close menu on mobile
  const handleNavigate = (path: string) => {
    console.log("handleNavigate is clicked ", path);
    navigate(path);
  };

  // Single resize handler - manages both isMobile state and menu visibility
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < MOBILE_BREAKPOINT;

      setIsMobile(mobile);

      if (mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen, isMobile }}>
    <PageHeaderProvider>
    <ScrollStateProvider>
    <div className="app-layout">
      <GoabxWorkSideMenu
          url={"/"}
          heading="Workspace Demo Application"
          userName="Edna Mode"
          userSecondaryText="edna.mode@example.com"
          open={menuOpen}
          onToggle={() => setMenuOpen(prev => !prev)}
          primaryContent={
            <>
              <GoabxWorkSideMenuItem
                  icon="search"
                  label="Search"
                  url={"/search"}
                  onClick={() => handleNavigate("/search")}
              />

              <GoabxWorkSideMenuItem
                  icon="list"
                  label="Clients"
                  url={"/clients"}
                  onClick={() => handleNavigate("/clients")}
              />

              <GoabxWorkSideMenuItem
                  icon="document"
                  label="Documents"
                  type="success"
                  badge="New"
                  url={"/documents"}
                  onClick={() => handleNavigate("/documents")}
              >
                <GoabxWorkSideMenuItem
                    label="Sub menu item 1"
                    url={"/documents/sub1"}
                    onClick={() => handleNavigate("/documents/sub1")}
                />
                <GoabxWorkSideMenuItem
                    label="Sub menu item 2"
                    url={"/documents/sub2"}
                    onClick={() => handleNavigate("/documents/sub2")}
                />
                <GoabxWorkSideMenuItem
                    label="Sub menu item 3"
                    url={"/documents/sub3"}
                    onClick={() => handleNavigate("/documents/sub3")}
                />
              </GoabxWorkSideMenuItem>
            </>
          }
          secondaryContent={
            <>
              <GoabxWorkSideMenuItem icon="notifications" label="Notifications" url={"none"}
                                 badge={unreadCount > 0 ? `${unreadCount}` : undefined} type="success"
                                 popoverContent={<NotificationContent/>}/>
            </>
          }
          accountContent={
            <>
              <GoabxWorkSideMenuItem
                  icon="settings"
                  label="Settings"
                  url="/settings"
                  onClick={() => handleNavigate("/settings")}
              />
              <GoabxWorkSideMenuItem
                  icon="log-out"
                  label="Log out"
                  url="/logout"
                  onClick={() => handleNavigate("/logout")}
              />
            </>
          }
      />

      <div
        className="card-container"
        style={{
          flex: 1,
          overflow: "hidden",
        }}>
        <WorkspaceContent />
      </div>
    </div>
    </ScrollStateProvider>
    </PageHeaderProvider>
    </MenuContext.Provider>
  );
}

export default App;
