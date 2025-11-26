import {
  GoaxWorkSideMenu,
  GoaxWorkSideMenuItem,
} from "@abgov/react-components/experimental";

import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuContext } from './contexts/MenuContext';
import { PageHeaderProvider } from './contexts/PageHeaderContext';
import { PageHeader } from './components/PageHeader';
import {NotificationContent} from "./notification/NotificationContent";
import { useNotifications } from "./contexts/NotificationContext";
import { MOBILE_BREAKPOINT } from "./constants/breakpoints";

export function App() {
  // On mobile (< MOBILE_BREAKPOINT), start with menu closed; on desktop, start with menu open
  const [menuOpen, setMenuOpen] = useState(window.innerWidth >= MOBILE_BREAKPOINT);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const { getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

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
    <div className="app-layout">
      <GoaxWorkSideMenu
          heading="Income and Employment Support (IES)"
          url="/"
          userName="Edna Mode"
          userSecondaryText="edna.mode@example.com"
          open={menuOpen}
          onToggle={() => setMenuOpen(prev => !prev)}
          primaryContent={
            <>
              <GoaxWorkSideMenuItem
                  icon="search"
                  label="Search"
                  badge="30"
                  url="/search"
              />

              <GoaxWorkSideMenuItem
                  icon="list"
                  label="Clients"
                  type="success"
                  badge="New"
                  url="/clients"
              />

              <GoaxWorkSideMenuItem
                  icon="calendar"
                  label="Schedule"
                  type="emergency"
                  badge="Urgent"
                  url="/schedule"
              />

              <GoaxWorkSideMenuItem
                  icon="document"
                  label="Documents"
                  url="/documents"
              >
                <GoaxWorkSideMenuItem
                    url="/documents/sub1"
                    label="Sub menu item 1"
                />
                <GoaxWorkSideMenuItem
                    url="/documents/sub2"
                    label="Sub menu item 2"
                />
                <GoaxWorkSideMenuItem
                    url="/documents/sub3"
                    label="Sub menu item 3"
                />
              </GoaxWorkSideMenuItem>

              <GoaxWorkSideMenuItem
                  icon="people"
                  label="Team"
                  url="/team"
              />
            </>
          }
          secondaryContent={
            <>
              <GoaxWorkSideMenuItem icon={"notifications"} label={"Notifications"} badge={unreadCount > 0 ? `${unreadCount}`: undefined} type={"success"} popoverContent={<NotificationContent/>}/>
              <GoaxWorkSideMenuItem
                  icon="help-circle"
                  label="Support"
                  url="/support"
              />
              <GoaxWorkSideMenuItem
                  icon="settings"
                  label="Settings"
                  url="/settings"
              />
            </>
          }
          accountContent={
            <>
              <GoaxWorkSideMenuItem
                  icon="person"
                  label="Account management"
                  url="/account"
              />
              <GoaxWorkSideMenuItem
                  icon="log-out"
                  label="Log out"
                  url="/logout"
              />
            </>
          }
      />

      <div className="card-container">
        {isMobile ? (
          <div className="mobile-content">
            <PageHeader />
            <Outlet />
          </div>
        ) : (
          <div className="desktop-card-container">
            <PageHeader />
            <Outlet />
          </div>
        )}
      </div>
    </div>
    </PageHeaderProvider>
    </MenuContext.Provider>
  );
}

export default App;
