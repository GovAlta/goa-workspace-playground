import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useMenu } from './MenuContext';

export type ScrollPosition = 'no-scroll' | 'at-top' | 'middle' | 'at-bottom';

interface ScrollStateContextType {
  scrollPosition: ScrollPosition;
  isScrollable: boolean;
}

const ScrollStateContext = createContext<ScrollStateContextType | undefined>(undefined);

interface ScrollStateProviderProps {
  children: ReactNode;
}

export function ScrollStateProvider({ children }: ScrollStateProviderProps) {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>('no-scroll');
  const [isScrollable, setIsScrollable] = useState(false);
  const { isMobile } = useMenu();

  const calculateScrollState = useCallback(() => {
    const containerSelector = isMobile ? '.mobile-content-container' : '.desktop-card-container';
    const container = document.querySelector(containerSelector);

    if (!container) {
      setScrollPosition('no-scroll');
      setIsScrollable(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const hasScroll = scrollHeight > clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    setIsScrollable(hasScroll);

    if (!hasScroll) {
      setScrollPosition('no-scroll');
      return;
    }

    // Hysteresis thresholds - different values for entering vs exiting states
    // This prevents jitter caused by layout shifts when padding changes
    const enterThreshold = 10;  // Distance to ENTER a boundary state (increased from 5 to account for layout shifts)
    const exitThreshold = 30;   // Distance to EXIT a boundary state (larger = more sticky)

    setScrollPosition(prevPosition => {
      // At top logic - stay at-top until we scroll past exitThreshold
      if (prevPosition === 'at-top') {
        if (scrollTop > exitThreshold) {
          return 'middle';
        }
        return 'at-top';
      }

      // At bottom logic - stay at-bottom until we scroll past exitThreshold
      if (prevPosition === 'at-bottom') {
        if (distanceFromBottom > exitThreshold) {
          return 'middle';
        }
        return 'at-bottom';
      }

      // From middle or initial state - use enterThreshold to enter boundary states
      if (scrollTop <= enterThreshold) {
        return 'at-top';
      }
      if (distanceFromBottom <= enterThreshold) {
        return 'at-bottom';
      }
      return 'middle';
    });
  }, [isMobile]);

  useEffect(() => {
    const containerSelector = isMobile ? '.mobile-content-container' : '.desktop-card-container';
    const container = document.querySelector(containerSelector);

    if (!container) return;

    // Throttle with RAF
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        calculateScrollState();
        rafId = null;
      });
    };

    // Initial calculation
    calculateScrollState();

    // Listen for scroll
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Listen for content size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateScrollState();
    });
    resizeObserver.observe(container);

    // Also observe children for content changes
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      resizeObserver.observe(children[i]);
    }

    // Window resize
    const handleWindowResize = () => {
      setTimeout(calculateScrollState, 10);
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      if (rafId) cancelAnimationFrame(rafId);
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
    throw new Error('useScrollState must be used within a ScrollStateProvider');
  }
  return context;
}
