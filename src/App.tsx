import {
  GoabxWorkSideMenu,
  GoabxWorkSideMenuItem,
} from "@abgov/react-components/experimental";

import { useNavigate } from "react-router-dom";
import { MenuContext } from "./contexts/MenuContext";
import { PageFooterProvider } from "./contexts/PageFooterContext";
import { ScrollStateProvider } from "./contexts/ScrollStateContext";
import { WorkspaceLayout } from "./components/WorkspaceLayout";
import { useWorkspaceMenuState } from "./hooks/useWorkspaceMenuState";

export function App() {
  const navigate = useNavigate();
  const { menuOpen, setMenuOpen, isMobile } = useWorkspaceMenuState();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen, isMobile }}>
      <PageFooterProvider>
        <ScrollStateProvider>
          <div className="app-layout">
            <GoabxWorkSideMenu
              url={"/"}
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
                    url={"/"}
                  />

                  <GoabxWorkSideMenuItem
                    icon="search"
                    label="Search"
                    url={"/search"}
                  />

                  <GoabxWorkSideMenuItem
                    icon="list"
                    label="Cases"
                    url={"/cases"}
                  />

                  <GoabxWorkSideMenuItem
                    icon="document"
                    label="Documents"
                    type="success"
                    badge="New"
                    url={"/documents"}
                  >
                    <GoabxWorkSideMenuItem
                      label="Sub menu item 1"
                      url={"/documents/sub1"}
                    />
                    <GoabxWorkSideMenuItem
                      label="Sub menu item 2"
                      url={"/documents/sub2"}
                    />
                    <GoabxWorkSideMenuItem
                      label="Sub menu item 3"
                      url={"/documents/sub3"}
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
                    url={"/notifications"}
                  />
                </>
              }
              accountContent={
                <>
                  <GoabxWorkSideMenuItem
                    icon="settings"
                    label="Settings"
                    url="/settings"
                  />
                  <GoabxWorkSideMenuItem
                    icon="log-out"
                    label="Log out"
                    url="/logout"
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
