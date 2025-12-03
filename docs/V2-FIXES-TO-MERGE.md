# V2 Component Fixes to Merge to Dev

**Created**: December 2, 2025
**Purpose**: Track fixes made in `vanessa/workspace` branch that need to be merged back into the main styling updates in dev.

---

## Overview

While working on the workspace playground, we've identified component issues that need fixes. These fixes are being made in the `vanessa/workspace` branch and should be merged back to the main dev branch for the V2 styling updates.

---

## Fixes Required

### 1. Checkbox Default Bottom Margin

**Status**: ✅ Complete (Dec 2, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/checkbox/Checkbox.svelte`
- `ui-components/libs/web-components/src/components/checkbox-list/CheckboxList.svelte`

**Problem**:
Checkbox component auto-sets bottom margin (`mb: "m"` for default, `mb: "s"` for compact) in `onMount()`. This was originally added as a workaround for stacking checkboxes before the checkbox-list component existed.

```javascript
// Line 89 of Checkbox.svelte
mb ??= size === "compact" ? "s" : "m";
```

**Impact**:
- Causes misalignment when checkbox is used in table cells
- Unexpected spacing in non-form contexts
- Checkbox-list relies on this margin instead of using its own gap

**Solution**:
1. Removed the auto `mb` assignment from Checkbox.svelte
2. Added `gap: var(--goa-space-m)` to CheckboxList.svelte to control spacing between items

**Notes**:
- Checkbox-list component now exists and should handle its own spacing
- Standalone checkboxes no longer have default margin
- Future work: Add `size` prop to checkbox-list with compact gap (`--goa-space-s`)

---

### 2. Table Checkbox Cell Padding

**Status**: ✅ Complete (Dec 2, 2025)
**Files**:
- `design-tokens/data/component-design-tokens/table-design-tokens.json`
- `ui-components/libs/web-components/src/assets/css/components.css`

**Problem**:
Checkbox cells in both table variants had incorrect or missing padding:
1. Regular variant: Only `td` was styled (2px), `th` had no specific styling
2. Relaxed variant: Token was 20px; `th` wasn't styled

**Solution**:
Added proper padding for both variants with header-specific adjustments.

**Final Padding Values**:

| Variant | Cell Type | Top Padding | Bottom Padding |
|---------|-----------|-------------|----------------|
| Regular | `td` (data) | 9px | 9px |
| Regular | `th` (header) | 9px | 15px |
| Relaxed | `td` (data) | 17px | 17px |
| Relaxed | `th` (header) | 17px | 15px |

**Token changes**:
```json
"table-padding-cell-checkbox": {
  "value": "9px",
  "type": "spacing",
  "description": "Vertical padding for checkbox cells in normal variant"
},
"table-padding-cell-checkbox-relaxed": {
  "value": "17px",
  "type": "spacing",
  "description": "Vertical padding for checkbox cells in relaxed variant"
}
```

**CSS changes**:
```css
/* Regular variant */
goa-table td.goa-table-cell--checkbox {
  padding-top: var(--goa-table-padding-cell-checkbox, 9px) !important;
  padding-bottom: var(--goa-table-padding-cell-checkbox, 9px) !important;
  text-align: center;
}

goa-table th.goa-table-cell--checkbox {
  padding-top: var(--goa-table-padding-cell-checkbox, 9px) !important;
  padding-bottom: 15px !important;
  text-align: center;
}

/* Relaxed variant */
goa-table[variant="relaxed"] td.goa-table-cell--checkbox {
  padding-top: var(--goa-table-padding-cell-checkbox-relaxed, 17px) !important;
  padding-bottom: var(--goa-table-padding-cell-checkbox-relaxed, 17px) !important;
}

goa-table[variant="relaxed"] th.goa-table-cell--checkbox {
  padding-top: var(--goa-table-padding-cell-checkbox-relaxed, 17px) !important;
  padding-bottom: 15px !important;
}
```

---

### 3. Table Sort Header Redesign

**Status**: ✅ Complete (Dec 2, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/table/TableSortHeader.svelte`
- `design-tokens/data/component-design-tokens/table-design-tokens.json`

**Problem**:
The table sort header showed both up/down carets stacked when unsorted, which was visually busy and didn't match modern patterns (e.g., Material UI).

**Solution**:
Redesigned sort header interaction to be cleaner and more intuitive:

1. **Icon changes**:
   - Changed from `caret-up`/`caret-down` to `arrow-up`/`arrow-down`
   - Icon size changed from `size="small"` (20px) to `size="3"` (20px) - same size, just using numeric token

2. **Visibility behavior**:
   - Default (unsorted): Icon hidden
   - Hover (unsorted): Shows up arrow with fade-in transition (0.15s)
   - Sorted ascending: Shows up arrow (always visible)
   - Sorted descending: Shows down arrow (always visible)

3. **Hover background color**:
   - Changed from `greyscale-100` to `greyscale-150` for better visibility
   - Updated both token and component fallback

**Token change**:
```json
"table-color-bg-heading-hover": {
  "value": "{color.greyscale.150}",
  "type": "color",
  "description": "Header background color on hover"
}
```

**Component changes**:
```svelte
<!-- Icons now use arrow instead of caret, hidden by default -->
{#if direction === "desc"}
  <goa-icon type="arrow-down" size="3" />
{:else if direction === "asc"}
  <goa-icon type="arrow-up" size="3" />
{:else}
  <div class="direction--none">
    <goa-icon type="arrow-up" size="3" />
  </div>
{/if}
```

```css
/* Unsorted - hidden by default, show on hover */
.direction--none {
  display: inline-flex;
  opacity: 0;
  transition: opacity 0.15s ease;
}

button:hover .direction--none {
  opacity: 1;
}
```

---

### 4. WorkSideMenuItem Badge Vertical Alignment

**Status**: ✅ Complete (Dec 2, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/work-side-menu/WorkSideMenuItem.svelte`

**Problem**:
Badge text in menu items was not vertically centered. The badge used `line-height` and `text-align` which didn't properly center the text.

**Solution**:
Changed badge styling to use flexbox for proper centering.

**CSS change**:
```css
.badge {
  color: var(--goa-color-text-light);
  height: 1.25rem;
  min-width: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--goa-work-side-menu-item-badge-text-size, var(--goa-font-size-2));
  background-color: var(--goa-work-side-menu-item-badge-background-color, var(--goa-color-success-default));
  border-radius: 1.25rem;
  padding: 0 6px;
}
```

---

### 5. WorkSideMenu Toggle Fix

**Status**: ✅ Complete (Dec 2, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/work-side-menu/WorkSideMenu.svelte`
- `ui-components/libs/react-components/src/experimental/work-side-menu/work-side-menu.tsx`

**Problem**:
Menu collapse/expand toggle wasn't working due to:
1. Double toggle - Svelte component listened to its own `_toggle` event and toggled internally, while React wrapper also toggled
2. Attribute vs property - React set `open` as HTML attribute (string) instead of JS property (boolean)

**Solution**:
1. Removed internal `_toggle` event listener from Svelte component
2. Added `useEffect` in React wrapper to set `open` as a property

**Session doc**: `docs/session-2025-12-02-collapse-expand-fix.md`

---

### 6. DataGrid Header Cell Focus Border Clipping

**Status**: ✅ Complete (Dec 3, 2025) - *Superseded by fix #9*
**Files**:
- `ui-components/libs/web-components/src/components/data-grid/DataGrid.svelte`

**Problem**:
When using keyboard navigation in a DataGrid/table, the focus outline on header cells (`<th>`) was clipped at the top, making the focus ring incomplete.

**Solution**:
Changed `setFocusedStyle` to use negative `outline-offset` so the outline is drawn inside the cell boundary instead of outside, preventing clipping. Later updated to 2px in fix #9.

**Note**: See fix #9 for final values (2px instead of 3px).

---

### 7. WorkSideMenu Arrow Key Navigation Stealing Focus

**Status**: ✅ Complete (Dec 3, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/work-side-menu/WorkSideMenu.svelte`

**Problem**:
When using arrow keys to navigate within a DataGrid, pressing up/down at the boundaries would cause focus to jump to the WorkSideMenu. This happened because WorkSideMenu had a global `window` keydown listener that handled all arrow key events.

**Solution**:
Modified `handleKeyDown` in WorkSideMenu to check if focus is actually inside the side menu before handling arrow key navigation.

**Code change**:
```javascript
function handleKeyDown(e: KeyboardEvent) {
  // Only handle arrow keys if focus is inside the side menu
  // This prevents stealing focus from other components (like DataGrid) that handle their own navigation
  const activeElement = document.activeElement;
  const focusInMenu = _rootEl?.contains(activeElement) ||
                      activeElement?.closest('goa-work-side-menu') !== null;

  switch (e?.key) {
    case "ArrowDown":
      if (focusInMenu) onArrow("down");
      break;
    case "ArrowUp":
      if (focusInMenu) onArrow("up");
      break;
    // ... rest unchanged
  }
}
```

---

### 8. Checkbox V2 Focus Ring Missing on Click

**Status**: ✅ Complete (Dec 3, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/checkbox/Checkbox.svelte`

**Problem**:
In V2 styling, clicking a checkbox showed the old V1 focus ring (box-shadow with no gap), while keyboard navigation showed the correct V2 focus ring (outline with 2px offset gap).

**Root cause**:
The V2 focus styles only targeted `:focus-visible`, not `:focus`. Mouse clicks trigger `:focus` while keyboard navigation triggers `:focus-visible`.

**Solution**:
Added `:focus` selectors alongside `:focus-visible` in the V2 styling block.

**Code change**:
```css
/* Before - only :focus-visible */
.v2 .container:has(:focus-visible),
.v2 .container:has(:focus-visible):hover,
/* ... */

/* After - both :focus-visible and :focus */
.v2 .container:has(:focus-visible),
.v2 .container:has(:focus),
.v2 .container:has(:focus-visible):hover,
.v2 .container:has(:focus):hover,
.v2 .container.selected:has(:focus-visible):hover,
.v2 .container.selected:has(:focus):hover,
.v2 label:hover .container.selected:has(:focus-visible),
.v2 label:hover .container.selected:has(:focus),
.v2 label:hover .container:has(:focus-visible),
.v2 label:hover .container:has(:focus) {
  outline: var(--goa-checkbox-border-focus);
  outline-offset: var(--goa-space-3xs);
  box-shadow: none;
}
```

---

### 9. DataGrid Focus Ring Updated to 2px

**Status**: ✅ Complete (Dec 3, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/data-grid/DataGrid.svelte`

**Problem**:
DataGrid cell focus ring was 3px, inconsistent with V2 focus styling (2px).

**Solution**:
Updated `setFocusedStyle` to use 2px outline with -2px offset.

**Code change**:
```javascript
function setFocusedStyle(el: HTMLElement) {
  if (!el) return;
  el.style.outline = '2px solid var(--goa-color-interactive-focus)';
  el.style.outlineOffset = '-2px';
}
```

---

### 10. TableSortHeader V2 Focus on Icon Only

**Status**: ✅ Complete (Dec 3, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/table/TableSortHeader.svelte`

**Problem**:
In V2, sortable headers had focus ring around the entire cell, while non-sortable headers had focus ring around just the cell content. This was inconsistent.

**Solution**:
Added `version` prop to TableSortHeader. In V2, the focus ring appears only on the sort icon (matching icon-button styling), and the icon becomes visible on focus (not just hover).

**Key changes**:
1. Added `version` prop with default "1"
2. V1: Focus ring on whole button (unchanged)
3. V2: Focus ring on icon only using `box-shadow` matching icon-button tokens
4. V2: Icon shows on `:focus-visible` (not just hover)

**Code highlights**:
```css
/* V1: Focus ring on whole button */
button:focus-visible {
  box-shadow: 0 0 0 var(--goa-border-width-l) var(--goa-color-interactive-focus);
}

/* V2: No focus ring on button, focus ring goes on icon instead */
button.v2:focus-visible {
  box-shadow: none;
}

/* V2: Focus ring on icon - matches icon-button V2 focus styling */
button.v2:focus-visible .icon-wrapper {
  box-shadow: 0 0 0 var(--goa-icon-button-focus-border-width, 2px) var(--goa-icon-button-focus-border-color, var(--goa-color-interactive-focus));
}

/* V2: Show icon on focus (not just hover) */
button.v2:focus-visible .direction--none {
  opacity: 1;
}
```

---

### 11. Link Focus Ring Clipping in Tables

**Status**: ✅ Complete (Dec 3, 2025)
**Files**:
- `ui-components/libs/web-components/src/components/link/Link.svelte`
- `ui-components/libs/web-components/src/assets/css/reset.css`

**Problem**:
Links inside tables showed clipped focus rings because V2 tables use `overflow: hidden` for rounded corners. Also, links inside `goa-link` showed double focus rings (one from reset.css, one from Link component).

**Solution**:
1. Changed Link component focus from `outline` to `box-shadow` (doesn't get clipped by overflow)
2. Added rule in reset.css to suppress anchor focus inside `goa-link`

**Link.svelte change**:
```css
/* Focus - uses box-shadow instead of outline to avoid clipping in tables with overflow:hidden */
.link:focus-within {
  border-radius: var(--goa-link-border-radius-focus, var(--goa-border-radius-s));
  outline: none;
  box-shadow: 0 0 0 var(--goa-link-focus-border-width, 2px) var(--goa-color-interactive-focus);
}
```

**reset.css addition**:
```css
/* Suppress focus on anchors inside goa-link - the Link component handles its own focus styling */
goa-link a:focus-visible, goa-link a:focus-within, goa-link a:focus {
  outline: none;
}
```

---

## Merge Strategy

These fixes are in `vanessa/workspace` branch. When ready to merge to dev:

1. Cherry-pick individual commits, OR
2. Create a PR from `vanessa/workspace` to dev with just these fixes
3. Ensure tests pass after merge

---

## Related Documentation

- Workspace playground setup: `/goa-workspace-playground/WORKSPACE-SETUP.md`
- Current approach doc: `/tasks/workspace-layout-template/2025-11-25-CURRENT-APPROACH.md`
- Session logs: `/goa-workspace-playground/docs/`
