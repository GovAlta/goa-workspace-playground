import React, { useRef, useEffect, useState, useCallback } from "react";

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface ScrollbarPosition {
  left: number;
  bottom: number;
  width: number;
}

/**
 * ScrollContainer - A reusable component for horizontal scrollable content with a sticky scrollbar.
 *
 * Use this component to wrap tables or other wide content that may need horizontal scrolling.
 * The container clips content at its edges, creating a "scroll off the edge" effect when
 * the content inside has its own margins.
 *
 * Features:
 * - Horizontal scrollbar stays visible at the bottom of the card container
 * - Syncs scroll position between content and fixed scrollbar
 *
 * Usage:
 *   <ScrollContainer>
 *     <div style={{marginLeft: 32, marginRight: 32}}>
 *       <GoabTable>...</GoabTable>
 *     </div>
 *   </ScrollContainer>
 */
export function ScrollContainer({ children, className = '' }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [scrollbarPosition, setScrollbarPosition] = useState<ScrollbarPosition>({ left: 0, bottom: 0, width: 0 });
  const isScrollingSelf = useRef(false);

  // Update dimensions and scrollbar position
  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    const cardContainer = document.querySelector('.desktop-card-container');
    if (!container) return;

    const newScrollWidth = container.scrollWidth;
    const newClientWidth = container.clientWidth;
    const needsScrollbar = newScrollWidth > newClientWidth;

    setScrollWidth(newScrollWidth);
    setShowScrollbar(needsScrollbar);

    // Calculate fixed position based on the inner content margins (aligns with table)
    // Use card container only for bottom position
    if (needsScrollbar && cardContainer) {
      const cardRect = cardContainer.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const bottomInset = 6; // Small inset from bottom

      // Get the first child element to determine its margin/padding
      const innerContent = container.firstElementChild as HTMLElement;
      if (innerContent) {
        const computedStyle = window.getComputedStyle(innerContent);
        const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
        const marginRight = parseFloat(computedStyle.marginRight) || 0;

        setScrollbarPosition({
          left: containerRect.left + marginLeft,
          bottom: window.innerHeight - cardRect.bottom + bottomInset,
          width: containerRect.width - marginLeft - marginRight
        });
      }
    }
  }, []);

  // Sync scroll positions
  const handleContentScroll = useCallback(() => {
    if (isScrollingSelf.current) return;
    const container = containerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!container || !scrollbar) return;

    isScrollingSelf.current = true;
    scrollbar.scrollLeft = container.scrollLeft;
    requestAnimationFrame(() => {
      isScrollingSelf.current = false;
    });
  }, []);

  const handleScrollbarScroll = useCallback(() => {
    if (isScrollingSelf.current) return;
    const container = containerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!container || !scrollbar) return;

    isScrollingSelf.current = true;
    container.scrollLeft = scrollbar.scrollLeft;
    requestAnimationFrame(() => {
      isScrollingSelf.current = false;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const scrollbar = scrollbarRef.current;
    const cardContainer = document.querySelector('.desktop-card-container');
    if (!container) return;

    // Initial dimension check
    updateDimensions();

    // Listen to content scroll
    container.addEventListener('scroll', handleContentScroll, { passive: true });

    // Listen to scrollbar scroll
    if (scrollbar) {
      scrollbar.addEventListener('scroll', handleScrollbarScroll, { passive: true });
    }

    // Listen to vertical scroll on card container to update scrollbar position
    const handleCardScroll = () => {
      requestAnimationFrame(updateDimensions);
    };
    if (cardContainer) {
      cardContainer.addEventListener('scroll', handleCardScroll, { passive: true });
    }

    // Observe size changes
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);
    if (cardContainer) {
      resizeObserver.observe(cardContainer);
    }

    // Window resize
    window.addEventListener('resize', updateDimensions, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleContentScroll);
      if (scrollbar) {
        scrollbar.removeEventListener('scroll', handleScrollbarScroll);
      }
      if (cardContainer) {
        cardContainer.removeEventListener('scroll', handleCardScroll);
      }
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, [handleContentScroll, handleScrollbarScroll, updateDimensions]);

  const scrollClasses = [
    'scroll-container',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        ref={containerRef}
        className={scrollClasses}
      >
        {children}
      </div>

      {/* Fixed scrollbar at bottom of card container */}
      {showScrollbar && (
        <div
          ref={scrollbarRef}
          className="scroll-container-scrollbar"
          style={{
            position: 'fixed',
            left: scrollbarPosition.left,
            bottom: scrollbarPosition.bottom,
            width: scrollbarPosition.width
          }}
        >
          <div
            className="scroll-container-scrollbar-inner"
            style={{ width: scrollWidth }}
          />
        </div>
      )}
    </>
  );
}
