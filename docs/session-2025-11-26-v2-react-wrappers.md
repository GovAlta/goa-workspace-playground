# Session: V2 React Wrappers Implementation

## Handoff Context for Fresh Claude Session

**Large Task:** Workspace Layout Template / V2 Component Styling
**Current Session:** Continuation from Nov 25 session
**Plan Location:** `./V2-REACT-WRAPPERS-PLAN.md`

### Background & Critical Context
The goa-workspace-playground needs to render components with V2 styling. The React wrappers in ui-components need to pass `version="2"` to their underlying web components. This session completed the React wrapper updates and discovered a branch synchronization issue.

**Related Work:**
- `/Users/tom/Projects/Design-system/tasks/workspace-layout-template/` - Parent task
- `/Users/tom/Projects/Design-system/ui-components/` - Component library
- PR #3097 (Badge V2) - Merged to dev but not in vanessa/workspace

### Current State
- 10 React wrappers updated with `version="2"`
- Table V2 styling fixed via `components.css`
- Branch `vanessa/workspace` is missing latest V2 Svelte implementations from `dev`
- All changes are uncommitted locally

### Session Goals
1. **Update remaining React wrappers** - Add `version="2"` to 10 components
2. **Fix table V2 styling** - Get border/border-radius working in React
3. **Verify V2 rendering** - Confirm components display V2 styles

---

## Implementation Tasks

### Task 1: Update React Wrappers with version="2"

Added `version?: string;` to WCProps and `version={"2"}` to JSX for each component.

**Files modified:**
- `libs/react-components/src/lib/badge/badge.tsx`
- `libs/react-components/src/lib/block/block.tsx`
- `libs/react-components/src/lib/button-group/button-group.tsx`
- `libs/react-components/src/lib/data-grid/data-grid.tsx`
- `libs/react-components/src/lib/dropdown/dropdown.tsx`
- `libs/react-components/src/lib/page-block/page-block.tsx`
- `libs/react-components/src/lib/radio-group/radio-group.tsx`
- `libs/react-components/src/lib/tab/tab.tsx`
- `libs/react-components/src/lib/tabs/tabs.tsx`
- `libs/react-components/src/lib/text/text.tsx`

**Validation:** Components render with `version="2"` attribute in HTML output.

### Task 2: Fix Table V2 Border Styling

**Problem:** Table wasn't showing V2 border/border-radius in React despite `version="2"` being passed.

**Investigation:** Multiple approaches tried:
1. `::slotted(table)` in Table.svelte - Svelte compiler mangled selector
2. `:global(::slotted(table))` - Still had scoping issues
3. `:host([version="2"]) ::slotted(table)` - Wrong selector context

**Root Cause Discovered:** The `components.css` file has global styles `goa-table table { border-collapse: collapse; }` that apply from light DOM. For React, the `<table>` is passed as light DOM content (slotted), so shadow DOM selectors can't override it.

**Solution:** Added to `components.css`:
```css
goa-table[version="2"] table {
  border-collapse: separate;
  border-spacing: 0;
  border: var(--goa-table-container-border, 1px solid #e7e7e7);
  border-radius: var(--goa-table-border-radius-container, 16px);
  overflow: hidden;
}
```

**Validation:** Table now displays with rounded corners and border.

---

## Key Technical Details

**Repository:** GovAlta/ui-components
**Branch:** `vanessa/workspace`
**Local Path:** `/Users/tom/Projects/Design-system/ui-components/`
**Playground Path:** `/Users/tom/Projects/Design-system/goa-workspace-playground/`
**Build Command:** `npm run build:prod` (Angular may fail - expected)
**Dev Server:** `http://localhost:5175/`

---

## Session Progress

### Completed
- [x] Updated 10 React wrappers with `version="2"`
- [x] Fixed table V2 styling via `components.css`
- [x] Rebuilt ui-components successfully
- [x] Verified table shows V2 border/border-radius

### Blocked
- [ ] See all V2 component styles (badge, etc.)
- Blocked by: `vanessa/workspace` branch missing V2 Svelte implementations from `dev`

---

## Decisions Made This Session

### Decision: Use components.css for Table V2 Styles (not shadow DOM)

**Context:** Shadow DOM `::slotted()` selectors weren't working for the table element.

**Options Considered:**
1. Shadow DOM `::slotted(table)` - Svelte compiler mangled selectors
2. `:host([version="2"]) ::slotted(table)` - Wrong context (slot not direct child of host)
3. Global CSS in `components.css` - Where other table styles already exist

**Chosen:** Option 3 - Global CSS in `components.css`

**Rationale:**
- React passes `<table>` as light DOM content
- `components.css` already has patterns like `goa-table td`, `goa-table th`
- Selector `goa-table[version="2"] table` works correctly from light DOM

**Impact:** This is the correct pattern for styling light DOM content in React wrappers.

---

## Next Session Handoff

**If continuing V2 styling work:**
1. Merge `origin/dev` into `vanessa/workspace` to get latest V2 Svelte implementations
   - 8 merge conflicts to resolve (Checkbox, IconButton, Link, Modal, Table, TableSortHeader, package files)
2. Rebuild and test all V2 components

**Alternative:**
- Work from a fresh branch based on `dev` that has all V2 implementations
- Cherry-pick the workspace-specific changes

**Current uncommitted changes:**
- 11 React wrapper files
- `components.css` (table V2 styles)
- `Table.svelte` (attempted shadow DOM fixes - may want to revert)
- `package.json` / `package-lock.json`

---

## Strategic Notes

The React wrapper `version="2"` changes are **complete and correct**. The issue is that the underlying Svelte components in `vanessa/workspace` don't have V2 styles implemented yet. These V2 implementations exist in `dev` (like Badge V2 from PR #3097) but haven't been merged into `vanessa/workspace`.

**Key Learning:** For multi-framework component libraries:
- Shadow DOM styles work for elements the component creates internally
- Light DOM content (passed via slots in React) needs global CSS targeting the host element

---

## Files Modified

**ui-components (libs/react-components/src/lib/):**
- `badge/badge.tsx` - Added version="2"
- `block/block.tsx` - Added version="2"
- `button-group/button-group.tsx` - Added version="2"
- `data-grid/data-grid.tsx` - Added version="2"
- `dropdown/dropdown.tsx` - Added version="2"
- `page-block/page-block.tsx` - Added version="2"
- `radio-group/radio-group.tsx` - Added version="2"
- `tab/tab.tsx` - Added version="2"
- `tabs/tabs.tsx` - Added version="2"
- `text/text.tsx` - Added version="2"

**ui-components (libs/web-components/src/):**
- `assets/css/components.css` - Added V2 table styles
- `components/table/Table.svelte` - Added ::slotted attempts (may revert)

---

## References
- [V2-REACT-WRAPPERS-PLAN.md](./V2-REACT-WRAPPERS-PLAN.md) - Original plan and proof of concept
- [PR #3097](https://github.com/GovAlta/ui-components/pull/3097) - Badge V2 (merged to dev)
- [CONTEXT.md](/Users/tom/Projects/Design-system/tasks/workspace-layout-template/CONTEXT.md) - Workspace layout context
