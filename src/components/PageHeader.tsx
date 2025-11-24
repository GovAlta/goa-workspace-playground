import React, { useEffect, useRef, useState, useCallback } from "react";
import { GoabText, GoabIconButton, GoabBlock } from '@abgov/react-components';
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
    const scrollContainer = isMobile ? null : document.querySelector('.desktop-card-container');

    let scrollTop: number;
    let scrollHeight: number;
    let offsetHeight: number;
    let scrollLeft = 0;
    let scrollWidth = 0;
    let clientWidth = 0;

    if (isMobile || !scrollContainer) {
      scrollTop = window.scrollY;
      scrollHeight = document.documentElement.scrollHeight;
      offsetHeight = window.innerHeight;
    } else {
      scrollTop = scrollContainer.scrollTop;
      scrollHeight = scrollContainer.scrollHeight;
      offsetHeight = scrollContainer.clientHeight;
      scrollLeft = scrollContainer.scrollLeft;
      scrollWidth = scrollContainer.scrollWidth;
      clientWidth = scrollContainer.clientWidth;
    }

    // Update sticky state based on scroll position
    const shouldBeSticky = scrollTop > 0;
    setIsSticky(shouldBeSticky);

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
  }, [isMobile]);

  // Set up scroll listener
  useEffect(() => {
    const scrollContainer = isMobile ? window : document.querySelector('.desktop-card-container');
    if (!scrollContainer) return;

    // Initial check
    handleScroll();

    const onScroll = () => handleScroll();

    if (scrollContainer instanceof Window) {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    } else {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      if (scrollContainer instanceof Window) {
        scrollContainer.removeEventListener('scroll', onScroll);
      } else {
        scrollContainer.removeEventListener('scroll', onScroll);
      }
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
