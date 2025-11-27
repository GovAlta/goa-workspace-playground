import {
  GoaxWorkSideMenu,
  GoaxWorkSideMenuItem,
} from "@abgov/react-components/experimental";

import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuContext } from './contexts/MenuContext';
import { PageHeaderProvider } from './contexts/PageHeaderContext';
import { PageHeader } from './components/PageHeader';
import {NotificationContent} from "./notification/NotificationContent";
import { useNotifications } from "./contexts/NotificationContext";
import { MOBILE_BREAKPOINT } from "./constants/breakpoints";

export function App() {
  const navigate = useNavigate();

  // On mobile (< MOBILE_BREAKPOINT), start with menu closed; on desktop, start with menu open
  const [menuOpen, setMenuOpen] = useState(window.innerWidth >= MOBILE_BREAKPOINT);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const { getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

  // Navigate and close menu on mobile
  const handleNavigate = (path: string) => {
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
    <div className="app-layout">
      <GoaxWorkSideMenu
          heading="Income and Employment Support (IES)"
          onHeadingClick={() => handleNavigate("/")}
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
                  onClick={() => handleNavigate("/search")}
              />

              <GoaxWorkSideMenuItem
                  icon="list"
                  label="Clients"
                  type="success"
                  badge="New"
                  onClick={() => handleNavigate("/clients")}
              />

              <GoaxWorkSideMenuItem
                  icon="calendar"
                  label="Schedule"
                  type="emergency"
                  badge="Urgent"
                  onClick={() => handleNavigate("/schedule")}
              />

              <GoaxWorkSideMenuItem
                  icon="document"
                  label="Documents"
                  onClick={() => handleNavigate("/documents")}
              >
                <GoaxWorkSideMenuItem
                    label="Sub menu item 1"
                    onClick={() => handleNavigate("/documents/sub1")}
                />
                <GoaxWorkSideMenuItem
                    label="Sub menu item 2"
                    onClick={() => handleNavigate("/documents/sub2")}
                />
                <GoaxWorkSideMenuItem
                    label="Sub menu item 3"
                    onClick={() => handleNavigate("/documents/sub3")}
                />
              </GoaxWorkSideMenuItem>

              <GoaxWorkSideMenuItem
                  icon="people"
                  label="Team"
                  onClick={() => handleNavigate("/team")}
              />
            </>
          }
          secondaryContent={
            <>
              <GoaxWorkSideMenuItem icon="notifications" label="Notifications" badge={unreadCount > 0 ? `${unreadCount}`: undefined} type="success" popoverContent={<NotificationContent/>}/>
              <GoaxWorkSideMenuItem
                  icon="help-circle"
                  label="Support"
                  onClick={() => handleNavigate("/support")}
              />
              <GoaxWorkSideMenuItem
                  icon="settings"
                  label="Settings"
                  onClick={() => handleNavigate("/settings")}
              />
            </>
          }
          accountContent={
            <>
              <GoaxWorkSideMenuItem
                  icon="person"
                  label="Account management"
                  onClick={() => handleNavigate("/account")}
              />
              <GoaxWorkSideMenuItem
                  icon="log-out"
                  label="Log out"
                  onClick={() => handleNavigate("/logout")}
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
