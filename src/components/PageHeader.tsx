import type { CSSProperties, ReactNode } from "react";
import { GoabText, GoabIconButton } from "@abgov/react-components";
import { useMenu } from "../contexts/MenuContext";
import { useScrollState } from "../contexts/ScrollStateContext";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  toolbar?: ReactNode;
  hideTitleOnScroll?: boolean;
}

export function PageHeader({
  title,
  actions,
  tabs,
  toolbar,
  hideTitleOnScroll,
}: PageHeaderProps) {
  const { isMobile, setMenuOpen } = useMenu();
  const { scrollPosition, isScrollable } = useScrollState();

  const isCollapsed = scrollPosition === "middle" || scrollPosition === "at-bottom";

  if (!title) return null;

  // Build class names based on state
  const headerClasses = [
    "page-header",
    isCollapsed ? "page-header--collapsed" : "page-header--expanded",
    isScrollable && scrollPosition
      ? `page-header--${scrollPosition.replace("-", "")}`
      : "",
    tabs ? "page-header--with-tabs" : "",
    toolbar ? "page-header--with-toolbar" : "",
    hideTitleOnScroll ? "page-header--hide-title-on-scroll" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={headerClasses}>
      <div className="page-header__content">
        <div className="page-header__title-container">
          {isMobile && (
            <GoabIconButton
              icon="menu"
              size="medium"
              variant="dark"
              onClick={() => setMenuOpen(true)}
              ariaLabel="Open menu"
            />
          )}
          {title && (
            <GoabText
              tag="h1"
              size={isCollapsed ? "heading-s" : isMobile ? "heading-m" : "heading-l"}
              mt="none"
              mb="none"
            >
              {title}
            </GoabText>
          )}
        </div>
        {/* Spacer pushes actions to the right in desktop mode */}
        {!isMobile && <div className="page-header__spacer" />}
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
      {tabs && (
        <div
          className="page-header__tabs"
          style={{ "--goa-tabs-margin-bottom": "0" } as CSSProperties}
        >
          {tabs}
        </div>
      )}
      {toolbar && (
        <div className="page-header__toolbar page-header__toolbar--expanded">
          {toolbar}
        </div>
      )}
    </div>
  );
}
