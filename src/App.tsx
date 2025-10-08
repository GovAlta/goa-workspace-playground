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
                    onClick={() => handleNavigate("/")}
                  />

                  <GoabxWorkSideMenuItem
                    icon="search"
                    label="Search"
                    url={"/search"}
                    onClick={() => handleNavigate("/search")}
                  />

                  <GoabxWorkSideMenuItem
                    icon="list"
                    label="Cases"
                    url={"/cases"}
                    onClick={() => handleNavigate("/cases")}
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
                  <GoabxWorkSideMenuItem
                    badge="Pending"
                    type="midtone"
                    icon="notifications"
                    label="Notifications"
                    url={"/notifications"}
                    onClick={() => handleNavigate("/notifications")}
                  />
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

            <WorkspaceLayout />
          </div>
        </ScrollStateProvider>
      </PageFooterProvider>
    </MenuContext.Provider>
  );
}

export default App;
