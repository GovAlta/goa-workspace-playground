import {
  GoaxWorkSideMenu,
  GoaxWorkSideMenuItem,
} from "@abgov/react-components/experimental";

import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuContext } from './contexts/MenuContext';
import {NotificationContent} from "./notification/NotificationContent";
import { useNotifications } from "./contexts/NotificationContext";

export function App() {
  // On mobile (< 624px), start with menu closed; on desktop, start with menu open
  const [menuOpen, setMenuOpen] = useState(window.innerWidth >= 624);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 624);

  const { getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

  // Single resize handler - manages both isMobile state and menu visibility
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 624;

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
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#F8F8F8"
    }}>
      <GoaxWorkSideMenu
          heading="Income and Employment Support (IES)"
          url="/"
          userName="Edna Mode"
          userSecondaryText="edna.mode@example.com"
          open={menuOpen}
          onToggle={() => {
            console.log('[App] onToggle called, toggling menuOpen from', menuOpen, 'to', !menuOpen);
            setMenuOpen(prev => !prev);
          }}
          popoverContent={
              <NotificationContent/>
          }
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

      <div style={{
        flex: 1,
        padding: isMobile ? "0" : "20px 20px 20px 0",
        overflow: "auto"
      }}>
        {isMobile ? (
          // Mobile: No card container, content directly rendered
          <div style={{
            backgroundColor: "white",
            minHeight: "100vh",
            padding: "1rem"
          }}>
            <Outlet />
          </div>
        ) : (
          // Desktop: Keep the card container
          <div style={{
            backgroundColor: "white",
            border: "1px solid #E9E9E9",
            borderRadius: "24px",
            minHeight: "calc(100vh - 40px)",
            padding: "2rem"
          }}>
            <Outlet />
          </div>
        )}
      </div>
    </div>
    </MenuContext.Provider>
  );
}

export default App;
