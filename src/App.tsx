import {
  GoaxWorkSideMenu,
  GoaxWorkSideMenuItem,
} from "@abgov/react-components/experimental";

import { Outlet } from 'react-router-dom';

export function App() {
  return (
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
              <GoaxWorkSideMenuItem
                  icon="notifications"
                  label="Notifications"
                  type="success"
                  badge="1"
                  url="/notifications"
              />
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
        padding: "20px 20px 20px 0",
        overflow: "auto"
      }}>
        <div style={{
          backgroundColor: "white",
          border: "1px solid #E9E9E9",
          borderRadius: "24px",
          minHeight: "calc(100vh - 40px)",
          padding: "2rem"
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
