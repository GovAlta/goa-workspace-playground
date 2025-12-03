# Session: Table/DataGrid Focus and Selection Fixes

**Date**: December 3, 2025
**Focus**: Table keyboard navigation, focus styling, and checkbox behavior

---

## Summary

This session addressed multiple focus ring issues in the DataGrid/Table components, improved V2 styling consistency, and enhanced checkbox selection behavior in the playground.

---

## Fixes Implemented

### 1. DataGrid Header Cell Focus Border Clipping

**Problem**: Focus outline on header cells was clipped at the top.

**Solution**: Changed `setFocusedStyle` in DataGrid.svelte to use negative `outline-offset` (-2px) so the outline is drawn inside the cell boundary.

**Files**: `ui-components/libs/web-components/src/components/data-grid/DataGrid.svelte`

---

### 2. WorkSideMenu Arrow Key Navigation Stealing Focus

**Problem**: Arrow keys in DataGrid would cause focus to jump to the WorkSideMenu because it had a global `window` keydown listener.

**Solution**: Added focus check in `handleKeyDown` - only handle arrow keys if focus is actually inside the side menu.

**Files**: `ui-components/libs/web-components/src/components/work-side-menu/WorkSideMenu.svelte`

---

### 3. Checkbox V2 Focus Ring Missing on Click

**Problem**: Clicking a checkbox showed V1 focus ring (box-shadow, no gap), while keyboard showed correct V2 focus ring (outline with offset).

**Root cause**: V2 styles only targeted `:focus-visible`, not `:focus`. Mouse clicks trigger `:focus`.

**Solution**: Added `:focus` selectors alongside `:focus-visible` in the V2 styling block.

**Files**: `ui-components/libs/web-components/src/components/checkbox/Checkbox.svelte`

---

### 4. DataGrid Focus Ring Updated to 2px

**Problem**: DataGrid cell focus ring was 3px, inconsistent with V2 focus styling (2px).

**Solution**: Updated `setFocusedStyle` to use 2px outline with -2px offset.

**Files**: `ui-components/libs/web-components/src/components/data-grid/DataGrid.svelte`

---

### 5. TableSortHeader V2 Focus on Icon Only

**Problem**: Sortable headers had focus ring around entire cell, inconsistent with non-sortable headers.

**Solution**:
- Added `version` prop to TableSortHeader
- V1: Focus ring on whole button (unchanged)
- V2: Focus ring on icon only using `box-shadow` matching icon-button tokens
- V2: Icon shows on `:focus-visible` (not just hover)

**Files**: `ui-components/libs/web-components/src/components/table/TableSortHeader.svelte`

---

### 6. Link Focus Ring Clipping in Tables

**Problem**: Links inside tables showed clipped/double focus rings because:
1. V2 tables use `overflow: hidden` for rounded corners
2. Both reset.css and Link component applied focus styles

**Solution**:
1. Changed Link component focus from `outline` to `box-shadow` (doesn't get clipped)
2. Added rule in reset.css to suppress anchor focus inside `goa-link`

**Files**:
- `ui-components/libs/web-components/src/components/link/Link.svelte`
- `ui-components/libs/web-components/src/assets/css/reset.css`

---

## Playground Improvements

### 7. Sort Dropdown - Added Status Option

**Change**: Added "Status" to the sort dropdown and reordered options.

**New order**: Status → Due date → Jurisdiction → Priority

**Files**: `goa-workspace-playground/src/routes/ClientsPage.tsx`

---

### 8. Header Checkbox Indeterminate State

**Problem**: Header checkbox only showed checked/unchecked, not indeterminate when some rows selected.

**Solution**:
- Calculate selection state from displayed data (`selectedCount`, `isAllSelected`, `isIndeterminate`)
- Added `indeterminate` prop to header checkbox
- Updated click behavior: indeterminate or checked → deselect all; unchecked → select all

**Files**:
- `goa-workspace-playground/src/routes/ClientsPage.tsx`
- `goa-workspace-playground/src/routes/SearchPage.tsx`

---

### 9. Keyboard Icon Position on Search Page

**Problem**: Keyboard navigation icon showed in bottom-left on SearchPage, bottom-right on ClientsPage.

**Solution**: Changed SearchPage from `keyboardIcon={false}` to `keyboardIconPosition="right"`.

**Files**: `goa-workspace-playground/src/routes/SearchPage.tsx`

---

## Documentation Updated

All component fixes documented in: `goa-workspace-playground/docs/V2-FIXES-TO-MERGE.md`

New fixes added as items #9, #10, #11.

---

## Key Learnings

### Focus Styling Consistency
- V2 uses 2px focus rings (not 3px)
- Use `box-shadow` instead of `outline` when inside containers with `overflow: hidden`
- Both `:focus` and `:focus-visible` need to be styled for mouse and keyboard consistency

### Version Prop Pattern
- New V2 behaviors should be scoped with `.v2` class
- Add `version` prop to components that need different V1/V2 behavior
- React wrappers already pass `version="2"` for new components

### Selection State
- Calculate `isAllSelected` and `isIndeterminate` from displayed data
- Don't store `allSelected` as separate state - derive it from data
