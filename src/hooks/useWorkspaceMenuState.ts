import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "../constants/breakpoints";

const MENU_STATE_KEY = "workspace-menu-open";

function getInitialMenuState(): boolean {
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    return false;
  }
  const saved = localStorage.getItem(MENU_STATE_KEY);
  if (saved !== null) {
    return saved === "true";
  }
  return true;
}

export function useWorkspaceMenuState() {
  const [menuOpen, setMenuOpen] = useState(getInitialMenuState);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  // Single resize handler - manages both isMobile state and menu visibility
  // Closes menu when window shrinks to give more room for content
  useEffect(() => {
    let previousWidth = window.innerWidth;

    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);

      if (width < previousWidth) {
        setMenuOpen(false);
      }

      previousWidth = width;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(MENU_STATE_KEY, String(menuOpen));
    }
  }, [menuOpen, isMobile]);

  return { menuOpen, setMenuOpen, isMobile };
}
