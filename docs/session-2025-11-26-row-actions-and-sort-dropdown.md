# Session: Row Action Menu and Sort Dropdown

**Date:** November 26, 2025

## Summary

Added row action menus to the clients table and implemented a sort dropdown that syncs with table header sorting.

## Changes Made

### 1. Row Action Menu (Ellipsis Button)

Replaced the single delete icon button with an ellipsis menu that opens a popover with multiple actions.

**Components used:**
- `GoabPopover` with `position="right"` (critical for avoiding scroll container issues)
- `GoabIcon` with `theme="filled"` for the ellipsis trigger
- Custom styled menu items (not GoabMenuAction - needed full control over styling)

**Menu options:**
- Edit (pencil icon)
- View details (eye icon)
- Delete (trash icon) - triggers existing delete modal

**Key implementation details:**

```tsx
<GoabPopover
    padded={true}
    minWidth="160px"
    position="right"  // Must use "right" - other positions break table layout
    target={
        <button className="row-action-trigger" aria-label={`Actions for ${client.name}`}>
            <GoabIcon type="ellipsis-horizontal" theme="filled" size="medium" />
        </button>
    }
>
    <div className="row-action-menu">
        <button className="row-action-menu__item" onClick={...}>
            <GoabIcon type="pencil" size="small" />
            Edit
        </button>
        {/* ... more items */}
    </div>
</GoabPopover>
```

### 2. Sort Dropdown

Added a dropdown next to the Filters button that allows sorting the table by Due date, Priority, or Jurisdiction.

**Implementation:**
- Uses `GoabDropdown` with new `size="compact"` prop (added to React wrapper)
- Syncs with table header sort indicators via `sortConfig` state
- Placeholder text: "—Sort by—"

```tsx
<GoabDropdown
    value={sortConfig.key || ''}
    onChange={(e) => {
        const key = e.value as keyof Client;
        if (key) {
            setSortConfig({ key, direction: 'asc' });
        }
    }}
    placeholder="—Sort by—"
    size="compact"
    width="160px"
>
    <GoabDropdownItem value="dueDate" label="Due date" />
    <GoabDropdownItem value="priority" label="Priority" />
    <GoabDropdownItem value="jurisdiction" label="Jurisdiction" />
</GoabDropdown>
```

### 3. Table Header Sort Sync

Updated `GoabTableSortHeader` components to reflect the current sort state:

```tsx
<GoabTableSortHeader
    name="dueDate"
    direction={sortConfig.key === 'dueDate' ? sortConfig.direction : 'none'}
>
    Due date
</GoabTableSortHeader>
```

### 4. React Wrapper Updates

**Added `size` prop to `GoabDropdown` React wrapper:**
- Location: `ui-components/libs/react-components/src/lib/dropdown/dropdown.tsx`
- Type: `"default" | "compact"`
- Passes through to web component

## CSS Added

New styles in `App.css` for the row action menu:

```css
/* Wrapper to contain the popover */
.row-action-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Trigger button for row actions */
.row-action-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--goa-border-radius-m);
  background: transparent;
  cursor: pointer;
  color: var(--goa-color-text-secondary);
}

.row-action-trigger:hover {
  background: var(--goa-color-greyscale-100);
  color: var(--goa-color-text-default);
}

.row-action-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--goa-color-interactive-focus);
}

/* Row action menu container */
.row-action-menu {
  display: flex;
  flex-direction: column;
  gap: var(--goa-space-2xs);
  margin: calc(-1 * var(--goa-space-m));
  padding: var(--goa-space-xs);
}

/* Row action menu items - styled like dropdown 2.0 */
.row-action-menu__item {
  display: flex;
  align-items: center;
  gap: var(--goa-space-s);
  width: 100%;
  padding: var(--goa-space-s) var(--goa-space-m);
  border: none;
  border-radius: var(--goa-border-radius-m);
  background: transparent;
  font: var(--goa-typography-body-m);
  color: var(--goa-color-text-default);
  cursor: pointer;
  text-align: left;
}

.row-action-menu__item:hover,
.row-action-menu__item:focus-visible {
  background: var(--goa-dropdown-item-color-bg-hover);
  color: var(--goa-dropdown-item-color-text-hover);
  outline: none;
}

.row-action-menu__item:focus-visible {
  box-shadow: 0 0 0 var(--goa-border-width-l) var(--goa-color-interactive-focus);
}
```

## Critical Discovery: Popover Position Bug

**Problem:** When using `GoabPopover` with `position="auto"` or `position="below"` inside or near a horizontally scrollable container, opening the popover causes the entire table to shift dramatically to the left.

**Root cause:** The popover uses `position: relative` on its host element and `position: absolute` on its content. Combined with the focus trap's `scrollIntoView()` behavior, this causes layout shifts in scroll containers.

**Solution:** Use `position="right"` which uses `position: fixed` for the popover content, positioning it relative to the viewport instead of a scroll container ancestor.

**Note:** This issue affects popovers even when they're outside the scroll container (like the Sort dropdown in the filter section). The `position="right"` workaround is necessary throughout.

## Files Modified

1. `goa-workspace-playground/src/routes/ClientsPage.tsx`
   - Added row action popover menu
   - Added sort dropdown
   - Synced table headers with sort state
   - Updated imports

2. `goa-workspace-playground/src/App.css`
   - Added row action menu styles

3. `ui-components/libs/react-components/src/lib/dropdown/dropdown.tsx`
   - Added `size` prop to interface and implementation

## Removed Unused Code

- Removed unused `GoabIconButton` and `GoabPageBlock` imports
- Cleaned up experimental CSS that didn't work during popover troubleshooting

## Known Issues / Future Work

1. **Popover position limitation** - Must use `position="right"` to avoid layout bugs. This should be investigated as a potential fix in the popover component itself.

2. **GoabMenuButton styling** - The built-in `GoabMenuButton` doesn't match the desired dropdown 2.0 hover styling, which is why custom buttons were used instead.

3. **GoabIconButton lacks theme prop** - Can't use filled icons with `GoabIconButton`; had to use custom button with `GoabIcon`.
