import React, { useEffect, useRef, useState, useCallback } from "react";

type HorizontalScrollPosition = 'left' | 'h-middle' | 'right' | null;

interface ShadowVisibility {
  left: boolean;
  right: boolean;
}

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ScrollContainer - A reusable component for horizontal scrollable content with shadow indicators.
 *
 * Use this component to wrap tables or other wide content that may need horizontal scrolling.
 * It provides visual shadow indicators to show users there is more content to scroll to,
 * similar to the GoA Modal scroll behavior.
 *
 * Usage:
 *   <ScrollContainer className="my-table-wrapper">
 *     <GoabTable>...</GoabTable>
 *   </ScrollContainer>
 */
export function ScrollContainer({ children, className = '' }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftShadowRef = useRef<HTMLDivElement>(null);
  const rightShadowRef = useRef<HTMLDivElement>(null);
  const [hScrollPos, setHScrollPos] = useState<HorizontalScrollPosition>(null);
  const [shadowVisibility, setShadowVisibility] = useState<ShadowVisibility>({ left: true, right: true });

  const updateShadowPositions = useCallback(() => {
    const container = containerRef.current;
    const scrollParent = document.querySelector('.desktop-card-container') || document.querySelector('.card-container');

    if (!container || !scrollParent) return;

    const containerRect = container.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();

    // Check for sticky header and account for its height
    const stickyHeader = scrollParent.querySelector('.page-header');
    const headerRect = stickyHeader?.getBoundingClientRect();
    const headerBottom = headerRect ? headerRect.bottom : parentRect.top;

    // Shadows should be at the viewport edges (parentRect), not table edges
    // They indicate "scroll to see more content" at the visible boundary
    const shadowLeft = parentRect.left;
    const shadowRight = parentRect.right - 40; // 40px is shadow width

    // Vertical bounds: shadow should only cover the visible table area
    const visibleTop = Math.max(containerRect.top, parentRect.top, headerBottom);
    const visibleBottom = Math.min(containerRect.bottom, parentRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    // Check if table is visible vertically
    const isTableVisibleVertically = visibleTop < visibleBottom;

    // Update shadow visibility state
    setShadowVisibility({
      left: isTableVisibleVertically,
      right: isTableVisibleVertically
    });

    if (leftShadowRef.current) {
      leftShadowRef.current.style.left = `${shadowLeft}px`;
      leftShadowRef.current.style.top = `${visibleTop}px`;
      leftShadowRef.current.style.height = `${visibleHeight}px`;
    }

    if (rightShadowRef.current) {
      rightShadowRef.current.style.left = `${shadowRight}px`;
      rightShadowRef.current.style.top = `${visibleTop}px`;
      rightShadowRef.current.style.height = `${visibleHeight}px`;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const scrollParent = document.querySelector('.desktop-card-container');
    const container = containerRef.current;

    if (!container) return;

    const scrollContainer = scrollParent || container;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    const contentWidth = container.scrollWidth;
    const viewportWidth = scrollParent ? scrollParent.clientWidth : container.clientWidth;
    const hasHorizontalScroll = contentWidth > viewportWidth;

    if (!hasHorizontalScroll) {
      setHScrollPos(null);
      // Still update shadow positions even if no horizontal scroll (for vertical scroll updates)
      requestAnimationFrame(updateShadowPositions);
      return;
    }

    if (scrollLeft === 0) {
      setHScrollPos('left');
    } else if (Math.abs(scrollWidth - scrollLeft - clientWidth) < 1) {
      setHScrollPos('right');
    } else {
      setHScrollPos('h-middle');
    }

    // Update shadow positions with animation frame for smoother updates
    requestAnimationFrame(updateShadowPositions);
  }, [updateShadowPositions]);

  useEffect(() => {
    const container = containerRef.current;
    // Use desktop-card-container for desktop, card-container for mobile
    const scrollParent = document.querySelector('.desktop-card-container') || document.querySelector('.card-container');

    if (!container) return;

    // Initial calculation
    handleScroll();

    // Debounced scroll handler for better performance
    let scrollTimeout: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleScroll();
      }, 10);
    };

    // Listen to scroll on the parent container (for both horizontal and vertical)
    if (scrollParent) {
      scrollParent.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    }

    // Also listen to scroll on the container itself if it has its own scrollbar
    container.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(handleScroll);
    });
    resizeObserver.observe(container);
    if (scrollParent) {
      resizeObserver.observe(scrollParent);
    }

    // MutationObserver to detect DOM changes
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(handleScroll);
    });
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Also update on window resize
    const handleWindowResize = () => {
      requestAnimationFrame(handleScroll);
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      if (scrollParent) {
        scrollParent.removeEventListener('scroll', debouncedHandleScroll);
      }
      container.removeEventListener('scroll', debouncedHandleScroll);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [handleScroll]);

  const scrollClasses = [
    'scroll-container',
    className
  ].filter(Boolean).join(' ');

  const showLeftShadow = (hScrollPos === 'right' || hScrollPos === 'h-middle') && shadowVisibility.left;
  const showRightShadow = (hScrollPos === 'left' || hScrollPos === 'h-middle') && shadowVisibility.right;

  return (
    <div ref={containerRef} className={scrollClasses}>
      {children}
      <div
        ref={leftShadowRef}
        className="scroll-shadow scroll-shadow--left"
        style={{ opacity: showLeftShadow ? 1 : 0 }}
      />
      <div
        ref={rightShadowRef}
        className="scroll-shadow scroll-shadow--right"
        style={{ opacity: showRightShadow ? 1 : 0 }}
      />
    </div>
  );
}
