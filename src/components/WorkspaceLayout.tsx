import { Outlet } from "react-router-dom";
import { useMenu } from "../contexts/MenuContext";
import { useScrollState } from "../contexts/ScrollStateContext";
import { PageFooter } from "./PageFooter";
import "./WorkspaceLayout.css";

export function WorkspaceLayout() {
  const { isMobile } = useMenu();
  const { scrollPosition } = useScrollState();

  if (isMobile) {
    return (
      <div className="mobile-content-container">
        <Outlet />
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="card-container">
      <div className="desktop-card-container" data-scroll-state={scrollPosition}>
        <Outlet />
        <PageFooter />
      </div>
    </div>
  );
}
