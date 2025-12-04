# Notification Centre Changes - December 4, 2025

Summary of changes across design-tokens, ui-components, and goa-workspace-playground for the notification centre feature.

---

## design-tokens (vanessa/workspace branch)

### Add tabs-margin-bottom component token
**Files:** `data/component-design-tokens/tabs-design-tokens.json`

Added `tabs-margin-bottom` token with value `{space.xl}` (2rem) to allow customization of the margin below tabs.

---

## ui-components (vanessa/workspace branch)

### Use tabs-margin-bottom token in Tabs component
**Files:** `Tabs.svelte`

Updated `margin-bottom` to reference `--goa-tabs-margin-bottom` CSS custom property (with 2rem fallback for backwards compatibility).

---

### Redesign WorkSideNotificationCard
**Files:** `WorkSideNotificationCard.svelte`, `work-side-notification-card.tsx`

Major redesign of the notification card:
- Added `urgent` prop for urgent notification styling
- Changed from type-based backgrounds to read/unread/urgent states
- Layout restructured: title + badge left, timestamp + unread dot right
- Unread dot (green, 12px) hidden with `visibility: hidden` when read (maintains spacing)
- Default badges auto-generated based on type (info, warning, success, critical)
- Styling: white (unread), greyscale-50 (read), warning-background (urgent)

---

## goa-workspace-playground (main branch)

### Implement notification centre layout and interactions
**Files:** `NotificationContent.tsx`, `NotificationContext.tsx`, `App.css`

Complete notification centre implementation:
- **Layout:** Sticky header (title + close + tabs), scrollable middle, sticky footer
- **Scroll shadows:** Header/footer shadows appear when content scrolls behind
- **Tabs:** Unread / Urgent / All with manual state management
- **Undo:** "Mark all as read" with undo support
- **Styling:**
  - Popover shadow: `0 4px 6px rgba(0, 0, 0, 0.15)`
  - Tabs margin override via `--goa-tabs-margin-bottom: 0`
  - Action links: text-default color, body-s, interactive-hover on hover

---

## For the Team

**New tokens:**
- `tabs-margin-bottom`: Controls margin below tabs container (default: 2rem)

**Updated components:**
- `goa-tabs`: Now uses `--goa-tabs-margin-bottom` token
- `goa-work-side-notification-card`: New `urgent` prop, read/unread visual states, automatic badges

**Playground demo:** Notification centre accessible from the bell icon in WorkSideMenu.
