import {
  GoabxWorkSideMenu,
  GoabxWorkSideMenuItem,
} from "@abgov/react-components/experimental";

import { MenuContext } from "./contexts/MenuContext";
import { PageFooterProvider } from "./contexts/PageFooterContext";
import { ScrollStateProvider } from "./contexts/ScrollStateContext";
import { WorkspaceLayout } from "./components/WorkspaceLayout";
import { useWorkspaceMenuState } from "./hooks/useWorkspaceMenuState";

export function App() {
  const { menuOpen, setMenuOpen, isMobile } = useWorkspaceMenuState();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

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
              primaryContent={
                <>
                  <GoabxWorkSideMenuItem
                    icon="grid"
                    label="Dashboard"
                    url={`${base}/`}
                  />

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
                    badge="Pending"
                    type="emergency"
                    icon="notifications"
                    label="Notifications"
                    url={`${base}/notifications`}
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
          </div>
        </ScrollStateProvider>
      </PageFooterProvider>
    </MenuContext.Provider>
  );
}

export default App;
