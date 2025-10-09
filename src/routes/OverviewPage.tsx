import React from "react";
import { GoabText, GoabPageBlock, GoabButton } from "@abgov/react-components";
import { useNavigate } from "react-router-dom";

export function OverviewPage() {
  const navigate = useNavigate();

  return (
    <GoabPageBlock width="content">
      <div style={{ marginBottom: "2rem" }}>
        <GoabButton type="tertiary" onClick={() => navigate("/")}>
          ← Back to Playground
        </GoabButton>
      </div>

      <GoabText tag="h1" size="heading-l" mb="l">
        PR 2937 - Work Side Menu Component
      </GoabText>

      <GoabText size="body-m" mb="xl">
        This is a new side navigation component designed for worker applications
        (like case management systems). The menu is displayed as a full-height
        sidebar on the left side of the screen.
      </GoabText>

      <GoabText tag="h2" size="heading-m" mt="xl" mb="m">
        Key Features Being Tested
      </GoabText>

      <div style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "4px",
        marginBottom: "1.5rem"
      }}>
        <GoabText size="body-s" mb="m"><strong>✓ User Profile Header</strong></GoabText>
        <GoabText size="body-xs" mb="l">
          Displays user name and email at the top of the sidebar
        </GoabText>

        <GoabText size="body-s" mb="m"><strong>✓ Three Menu Sections (Slots)</strong></GoabText>
        <GoabText size="body-xs" mb="l">
          • Primary: Main navigation items<br/>
          • Secondary: Utility actions (notifications, support, settings)<br/>
          • Account: User account management
        </GoabText>

        <GoabText size="body-s" mb="m"><strong>✓ Submenu Support</strong></GoabText>
        <GoabText size="body-xs" mb="l">
          Click "Search" to expand/collapse nested submenu items
        </GoabText>

        <GoabText size="body-s" mb="m"><strong>✓ Badge Notifications</strong></GoabText>
        <GoabText size="body-xs" mb="l">
          Three types: normal (numbers), success ("New"), emergency ("Urgent")
        </GoabText>

        <GoabText size="body-s" mb="m"><strong>✓ Current/Active State</strong></GoabText>
        <GoabText size="body-xs" mb="l">
          Click different menu items to see the active state highlighting
        </GoabText>

        <GoabText size="body-s" mb="m"><strong>✓ Collapsible Menu</strong></GoabText>
        <GoabText size="body-xs">
          Use the collapse/expand button at the bottom to toggle sidebar width
        </GoabText>
      </div>

      <div style={{
        backgroundColor: "#fff3cd",
        padding: "1.5rem",
        borderRadius: "4px",
        marginTop: "2rem"
      }}>
        <GoabText size="body-s" mb="m">
          <strong>⚠️ Note: V2 Design Tokens Required</strong>
        </GoabText>
        <GoabText size="body-xs">
          This component requires the v2-2998-coded-component-updates design tokens
          for proper colors and borders. The tokens have been installed for this test.
        </GoabText>
      </div>
    </GoabPageBlock>
  );
}
