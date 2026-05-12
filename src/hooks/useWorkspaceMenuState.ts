import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "../constants/breakpoints";

const MENU_STATE_KEY = "workspace-menu-open";
function getInitialDesktopMenuState(): boolean {
  const saved = localStorage.getItem(MENU_STATE_KEY);
  if (saved !== null) {
    return saved === "true";
  }
  return true;
}

export function useWorkspaceMenuState() {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(getInitialDesktopMenuState);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    let previousWidth = window.innerWidth;

    const handleResize = () => {
      const resizedWidth = window.innerWidth;
      const isResizedWidthOnMobile = resizedWidth < MOBILE_BREAKPOINT;
      setIsMobile(isResizedWidthOnMobile);

      if (resizedWidth < previousWidth && !isResizedWidthOnMobile) {
        setDesktopMenuOpen(false);
      }

      previousWidth = resizedWidth;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(MENU_STATE_KEY, String(desktopMenuOpen));
    }
  }, [desktopMenuOpen, isMobile]);

  const menuOpen = isMobile ? true : desktopMenuOpen;
  const setMenuOpen: typeof setDesktopMenuOpen = (value) => {
    if (isMobile) return;
    setDesktopMenuOpen(value);
  };

  return { menuOpen, setMenuOpen, isMobile };
}
