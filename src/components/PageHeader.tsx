import React, { useEffect, useRef, useState, useCallback } from "react";
import {GoabText, GoabIconButton, GoabBlock } from '@abgov/react-components';
import { useMenu } from '../contexts/MenuContext';
import { usePageHeaderContext } from '../contexts/PageHeaderContext';

interface PageHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

type ScrollPosition = 'top' | 'middle' | 'bottom' | null;
type HScrollPosition = 'left' | 'h-middle' | 'right' | null;

export function PageHeader({ title: propTitle, actions: propActions }: PageHeaderProps) {
  const { isMobile, setMenuOpen } = useMenu();
  const { title: contextTitle, actions: contextActions } = usePageHeaderContext();

  // Use props if provided, otherwise use context
  const title = propTitle ?? contextTitle;
  const actions = propActions ?? contextActions;

  const [isSticky, setIsSticky] = useState(false);
  const [scrollPos, setScrollPos] = useState<ScrollPosition>(null);
  const [hScrollPos, setHScrollPos] = useState<HScrollPosition>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Combined scroll handler for both sticky detection and scroll position
  const handleScroll = useCallback(() => {

      let scrollTop: number;
      let scrollHeight: number;
      let offsetHeight: number;
      let scrollLeft = 0;
      let scrollWidth = 0;
      let clientWidth = 0;
      let scrollContainer: Element | null = null;

      if (isMobile) {
          // In mobile mode, we need to check the card-container for scroll
          scrollContainer = document.querySelector(".card-container");
          if (scrollContainer) {
              scrollTop = scrollContainer.scrollTop;
              scrollHeight = scrollContainer.scrollHeight;
              offsetHeight = scrollContainer.clientHeight;
              scrollLeft = scrollContainer.scrollLeft;
              scrollWidth = scrollContainer.scrollWidth;
              clientWidth = scrollContainer.clientWidth;
          } else {
              return;
          }
      } else {
          // In desktop mode, use the desktop-card-container
          scrollContainer = document.querySelector('.desktop-card-container');
          if (scrollContainer) {
              scrollTop = scrollContainer.scrollTop;
              scrollHeight = scrollContainer.scrollHeight;
              offsetHeight = scrollContainer.clientHeight;
              scrollLeft = scrollContainer.scrollLeft;
              scrollWidth = scrollContainer.scrollWidth;
              clientWidth = scrollContainer.clientWidth;
          } else {
              return;
          }
      }

      const shouldBeSticky = scrollTop > 0;
      setIsSticky(shouldBeSticky);

      // Add/remove content-scrolled class to desktop-card-container
      if (!isMobile && scrollContainer) {
          if (shouldBeSticky) {
              scrollContainer.classList.add('content-scrolled');
          } else {
              scrollContainer.classList.remove('content-scrolled');
          }
      }

      // Update vertical scroll position for shadow effects
      const hasVerticalScroll = scrollHeight > offsetHeight;
      if (!hasVerticalScroll) {
          setScrollPos(null);
      } else if (scrollTop === 0) {
          setScrollPos('top');
      } else if (Math.abs(scrollHeight - scrollTop - offsetHeight) < 1) {
          setScrollPos('bottom');
      } else {
          setScrollPos('middle');
      }

      // Update horizontal scroll position for shadow effects
      const hasHorizontalScroll = scrollWidth > clientWidth;
      let newHScrollPos: HScrollPosition = null;
      if (!hasHorizontalScroll) {
          newHScrollPos = null;
      } else if (scrollLeft === 0) {
          newHScrollPos = 'left';
      } else if (Math.abs(scrollWidth - scrollLeft - clientWidth) < 1) {
          newHScrollPos = 'right';
      } else {
          newHScrollPos = 'h-middle';
      }
      setHScrollPos(newHScrollPos);

      // Apply horizontal scroll class to the container directly
      if (scrollContainer) {
          scrollContainer.classList.remove('h-scroll--left', 'h-scroll--right', 'h-scroll--h-middle');
          if (newHScrollPos) {
              scrollContainer.classList.add(`h-scroll--${newHScrollPos}`);
          }
      }
  }, [isMobile])

  // Set up scroll listener and resize observers
  useEffect(() => {
    // Get the correct scroll container based on mobile/desktop
    const scrollContainer = document.querySelector(
      isMobile ? '.card-container' : '.desktop-card-container'
    );

    // Initial check
    handleScroll();

    // Define scroll handler
    const onScroll = () => handleScroll();

    // Add scroll listener to the correct container
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    }

    // Add resize observer for the scroll container (both mobile and desktop)
    let resizeObserver: ResizeObserver | null = null;
    if (scrollContainer) {
      resizeObserver = new ResizeObserver(() => {
        handleScroll();
      });
      resizeObserver.observe(scrollContainer);
    }

    // Add window resize listener to handle browser resizing
    const handleWindowResize = () => {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        handleScroll();
      }, 10);
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    // Cleanup function
    return () => {
      // Get the scroll container again for cleanup (in case it changed)
      const cleanupContainer = document.querySelector(
        isMobile ? '.card-container' : '.desktop-card-container'
      );

      // Clean up scroll listeners
      if (cleanupContainer) {
        cleanupContainer.removeEventListener('scroll', onScroll);
      }

      // Clean up resize observer
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      // Clean up window resize listener
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isMobile, handleScroll]);

  // Don't render if no title
  if (!title) return null;

  return (
    <>
      {/* Sentinel element to detect when header should become sticky */}
      <div ref={sentinelRef} className="page-header-sentinel" />

      <div
        ref={headerRef}
        className={`page-header ${isSticky ? 'page-header--sticky' : ''} ${isSticky && scrollPos ? `page-header--${scrollPos}` : ''}`}
      >
        <div className="page-header__content">
          <div className="page-header__title-container">
            {isMobile && (
              <GoabIconButton
                icon="menu"
                size="large"
                variant="dark"
                onClick={() => setMenuOpen(true)}
                ariaLabel="Open menu"
              />
            )}
            <GoabText
              tag="h1"
              size={isMobile ? "heading-l" : "heading-xl"}
              mt="none"
              mb="none"
            >
              {title}
            </GoabText>
          </div>
          {actions && (
            isMobile ? (
              <GoabBlock gap="s" direction="column">
                {actions}
              </GoabBlock>
            ) : (
              <div className="page-header__actions">{actions}</div>
            )
          )}
        </div>
      </div>

      {/* Spacer to prevent content jump when header becomes sticky */}
      {isSticky && headerRef.current && (
        <div style={{ height: headerRef.current.offsetHeight }} />
      )}
    </>
  );
}
