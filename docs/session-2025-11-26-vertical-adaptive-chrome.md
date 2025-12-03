# Session: Vertical Adaptive Chrome Implementation

**Date**: November 26, 2025
**Focus**: Implementing adaptive visual chrome for the workspace content card

---

## Summary

Implemented the "adaptive visual chrome" pattern - the content card's margins, borders, and border-radius appear/disappear based on vertical scroll position. This creates a floating card effect when at the top, and edge-to-edge content when scrolling through the middle.

---

## Key Implementations

### 1. ScrollStateContext

**File**: `src/contexts/ScrollStateContext.tsx`

New context that provides scroll state to any consuming component:
- `scrollPosition`: `'no-scroll' | 'at-top' | 'middle' | 'at-bottom'`
- `isScrollable`: boolean indicating if content exceeds viewport

**Key feature - Hysteresis**: Uses different thresholds for entering vs exiting boundary states to prevent jitter:
- `enterThreshold = 5px` - Distance to enter a boundary state
- `exitThreshold = 25px` - Distance to exit a boundary state

This 20px gap absorbs layout shifts from padding changes, preventing oscillation.

### 2. Adaptive Card Chrome (CSS)

**File**: `src/App.css`

The `.card-container` wrapper padding changes based on scroll state:

| State | Padding | Card Appearance |
|-------|---------|-----------------|
| `no-scroll` | 20px all around | Full chrome - all borders, 24px radius |
| `at-top` | 20px top, 0 bottom | Top chrome only - top radius, no bottom border |
| `middle` | 0 vertical | Side borders only - no radius |
| `at-bottom` | 0 top, 20px bottom | Bottom chrome only - bottom radius |

### 3. PageHeader Expand/Collapse

**File**: `src/components/PageHeader.tsx`

Header now consumes `useScrollState()` instead of managing its own scroll detection:
- **Expanded** (at-top/no-scroll): `heading-l`, larger padding (24px 32px)
- **Collapsed** (middle/at-bottom): `heading-s`, compact padding (12px 32px), subtle bottom border

Removed duplicate scroll listeners - context handles all scroll detection.

### 4. Horizontal Scrollbar Alignment

**File**: `src/components/ScrollContainer.tsx`

Updated scrollbar positioning to align with the table content (not the outer container):
- Reads inner content's margins via `getComputedStyle()`
- Positions scrollbar within those margins
- Uses container's visible width, not scrollable width

---

## UI Refinements

### ClientsPage Updates

- Removed "My clients" subheading
- Moved tabs to left of search row (same line)
- Tabs bottom margin removed (-2rem to counteract shadow DOM margin)
- Filter section gets 16px bottom margin
- Added second "Filter" button (placeholder for future functionality)
- Renamed first filter button to "Search" (no icon)
- Sort dropdown placeholder: "— Sort by —"

### Clear All Link Fix

GoabLink doesn't support click handlers (it's for navigation only). Replaced with native `<button>` styled as a link:

```css
.clear-all-link {
  background: none;
  border: none;
  color: var(--goa-color-text-default);
  font: var(--goa-typography-body-s);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: var(--goa-space-2xs);
}
```

### Content Bottom Padding

Added `paddingBottom: 32px` to ClientsPage wrapper for space between table and card bottom.

### Responsive Layout (ClientsPage)

Three breakpoints for the filter/tabs section:

| Breakpoint | Behavior |
|------------|----------|
| > 1080px | Tabs and search/actions on same row |
| 1080px - 624px | Stacked: search row above tabs (column-reverse) |
| < 740px | Actions (Sort + Filter) stack below search row |
| < 624px | Extra margin-bottom (48px) to compensate for tabs' internal margin |

Markup restructured with wrapper divs:
- `.clients-search-group` - Contains input + Search button
- `.clients-actions-group` - Contains Sort dropdown + Filter button

---

## Technical Insights

### Hysteresis Pattern for Scroll Detection

The key insight for preventing jitter at scroll boundaries:

```typescript
setScrollPosition(prevPosition => {
  // If already at-top, require more scroll to leave
  if (prevPosition === 'at-top') {
    if (scrollTop > exitThreshold) return 'middle';
    return 'at-top';
  }

  // From middle, use smaller threshold to enter boundary
  if (scrollTop <= enterThreshold) return 'at-top';
  return 'middle';
});
```

The gap between thresholds (20px) matches the padding change, so layout shifts don't cause state changes.

### GoabLink Limitation

GoabLink (`@abgov/react-components`) is designed for navigation links only:
- Has `action`, `actionArgs` props for navigation
- No `onClick` or `_click` prop
- For action triggers, use `<button>` styled as link or `GoabButton type="tertiary"`

---

## Files Changed

| File | Changes |
|------|---------|
| `src/contexts/ScrollStateContext.tsx` | Created - scroll state context with hysteresis |
| `src/App.tsx` | Added ScrollStateProvider, WorkspaceContent component |
| `src/App.css` | Adaptive chrome CSS, clear-all-link styles |
| `src/components/PageHeader.tsx` | Consumes context, expand/collapse states |
| `src/components/ScrollContainer.tsx` | Scrollbar aligns with inner content |
| `src/routes/ClientsPage.tsx` | UI layout changes, clear all button |

---

## Known Issues Resolved

1. **Scroll jitter at boundaries** - Fixed with hysteresis thresholds
2. **GoabLink onClick not working** - Replaced with native button
3. **Horizontal scrollbar width** - Now matches table, not container

---

## Next Steps

- Consider adding the same adaptive chrome pattern to push drawer content
- Test mobile behavior thoroughly
- When `GoabScrollableContainer` ships with `onScrollStateChange`, context can be updated to use it
