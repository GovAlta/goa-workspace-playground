import React, { useEffect, useRef, useState } from "react";
import { GoabText, GoabIconButton, GoabBlock } from '@abgov/react-components';
import { useMenu } from '../contexts/MenuContext';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  const { isMobile, setMenuOpen } = useMenu();
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) {
      setIsSticky(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isMobile]);

  return (
    <>
      {/* Sentinel element to detect when header should become sticky */}
      {isMobile && <div ref={sentinelRef} className="page-header-sentinel" />}

      <div
        ref={headerRef}
        className={`page-header ${isMobile && isSticky ? 'page-header--sticky' : ''}`}
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
      {isMobile && isSticky && headerRef.current && (
        <div style={{ height: headerRef.current.offsetHeight }} />
      )}
    </>
  );
}
