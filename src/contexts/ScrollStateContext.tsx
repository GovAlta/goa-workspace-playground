import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useMenu } from "./MenuContext";

export type ScrollPosition = "no-scroll" | "at-top" | "middle" | "at-bottom";

interface ScrollStateContextType {
  scrollPosition: ScrollPosition;
  isScrollable: boolean;
}

const ScrollStateContext = createContext<ScrollStateContextType | undefined>(undefined);

interface ScrollStateProviderProps {
  children: ReactNode;
}

const TRANSITION_LOCK_MS = 0;

export function ScrollStateProvider({ children }: ScrollStateProviderProps) {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>("no-scroll");
  const [isScrollable, setIsScrollable] = useState(false);
  const { isMobile } = useMenu();

  const transitionLockRef = useRef<number | null>(null);
  const lastPositionRef = useRef<ScrollPosition>("no-scroll");

  const calculateScrollState = useCallback(() => {
    const containerSelector = isMobile
      ? ".mobile-content-container"
      : ".desktop-card-container";
    const container = document.querySelector(containerSelector);

    if (!container) {
      setScrollPosition("no-scroll");
      setIsScrollable(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollOverflow = scrollHeight - clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    const scrollableEnterThreshold = 1;
    const scrollableExitThreshold = 100;

    const enterThreshold = 5; // Distance to ENTER a boundary state
    const exitThreshold = 15; // Distance to EXIT a boundary state

    setIsScrollable((prev) => {
      if (prev) {
        return scrollOverflow > -scrollableExitThreshold;
      } else {
        return scrollOverflow > scrollableEnterThreshold;
      }
    });

    const calculateTargetPosition = (prevPosition: ScrollPosition): ScrollPosition => {
      if (prevPosition === "no-scroll") {
        if (scrollOverflow <= scrollableEnterThreshold) {
          return "no-scroll";
        }
        if (scrollTop <= enterThreshold) {
          return "at-top";
        }
        if (distanceFromBottom <= enterThreshold) {
          return "at-bottom";
        }
        return "middle";
      }

      if (scrollOverflow <= -scrollableExitThreshold) {
        return "no-scroll";
      }

      if (prevPosition === "at-top") {
        if (scrollTop > exitThreshold) {
          return "middle";
        }
        return "at-top";
      }

      if (prevPosition === "at-bottom") {
        if (distanceFromBottom > exitThreshold) {
          return "middle";
        }
        return "at-bottom";
      }

      if (scrollTop <= enterThreshold) {
        return "at-top";
      }
      if (distanceFromBottom <= enterThreshold) {
        return "at-bottom";
      }
      return "middle";
    };

    setScrollPosition((prevPosition) => {
      const targetPosition = calculateTargetPosition(prevPosition);

      if (targetPosition !== prevPosition) {
        const now = Date.now();

        if (transitionLockRef.current && now < transitionLockRef.current) {
          return prevPosition;
        }

        transitionLockRef.current = now + TRANSITION_LOCK_MS;
        lastPositionRef.current = targetPosition;
        return targetPosition;
      }

      return prevPosition;
    });
  }, [isMobile]);

  useEffect(() => {
    const containerSelector = isMobile
      ? ".mobile-content-container"
      : ".desktop-card-container";
    const container = document.querySelector(containerSelector);

    if (!container) return;

    let animationFrameId: number | null = null;
    const handleScroll = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        calculateScrollState();
        animationFrameId = null;
      });
    };

    // This prevents flicker when padding/border-radius transitions change container size
    let resizeDebounceId: ReturnType<typeof setTimeout> | null = null;
    const TRANSITION_DURATION = 250; // Slightly longer than CSS 0.2s to ensure transition completes

    const handleResize = () => {
      if (resizeDebounceId) {
        clearTimeout(resizeDebounceId);
      }
      resizeDebounceId = setTimeout(() => {
        calculateScrollState();
        resizeDebounceId = null;
      }, TRANSITION_DURATION);
    };

    calculateScrollState();

    container.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      resizeObserver.observe(children[i]);
    }

    const handleWindowResize = () => {
      setTimeout(calculateScrollState, 10);
    };
    window.addEventListener("resize", handleWindowResize, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeDebounceId) clearTimeout(resizeDebounceId);
    };
  }, [isMobile, calculateScrollState]);

  return (
    <ScrollStateContext.Provider value={{ scrollPosition, isScrollable }}>
      {children}
    </ScrollStateContext.Provider>
  );
}

export function useScrollState() {
  const context = useContext(ScrollStateContext);
  if (context === undefined) {
    throw new Error("useScrollState must be used within a ScrollStateProvider");
  }
  return context;
}
