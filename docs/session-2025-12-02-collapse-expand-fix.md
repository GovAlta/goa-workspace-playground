# Session: Fix WorkSideMenu Collapse/Expand Toggle

**Date**: December 2, 2025

## Summary

Fixed the collapse/expand toggle button for `GoabxWorkSideMenu`. The menu was not responding to clicks on the toggle button - clicking did nothing visually even though state was changing.

---

## Root Cause

Two separate issues were causing the problem:

### Issue 1: Double Toggle (in Svelte component)

The Svelte web component (`WorkSideMenu.svelte`) was listening for its own `_toggle` event and toggling the `open` state internally:

```javascript
// In addEventListeners():
_rootEl.addEventListener("_toggle", toggleMenu);

// toggleMenu function:
function toggleMenu() {
  open = !open;  // Toggles internally
  _showTooltip = false;
}
```

Meanwhile, the React wrapper was ALSO listening for `_toggle` and calling the parent's `onToggle`:

```javascript
el.current?.addEventListener("_toggle", onToggle);
// onToggle calls setMenuOpen(prev => !prev)
```

**Result**: Both toggled the state, so `open` went `false → true → false` (double toggle = no change).

### Issue 2: Attribute vs Property (in React wrapper)

React was setting `open` as an HTML attribute:

```jsx
<goa-work-side-menu open={open ? true : false} />
```

This renders as `open="true"` (a string attribute). Web components with Svelte need boolean properties set directly on the element, not as string attributes.

---

## The Fix

### File 1: `ui-components/libs/web-components/src/components/work-side-menu/WorkSideMenu.svelte`

Removed the internal `_toggle` event listener. The component should NOT toggle itself when `_toggle` fires - that event is for external consumers (like React) to handle.

**Before:**
```javascript
function addEventListeners() {
  _rootEl.addEventListener("_click", setCurrentUrl);
  _rootEl.addEventListener("_mountItem", addMenuLink);
  _rootEl.addEventListener("_hoverItem", handleHover as EventListener);
  _rootEl.addEventListener("_toggle", toggleMenu);  // REMOVED
  // ...
}
```

**After:**
```javascript
function addEventListeners() {
  _rootEl.addEventListener("_click", setCurrentUrl);
  _rootEl.addEventListener("_mountItem", addMenuLink);
  _rootEl.addEventListener("_hoverItem", handleHover as EventListener);
  // _toggle listener removed - let external consumers control open state
  // ...
}
```

### File 2: `ui-components/libs/react-components/src/experimental/work-side-menu/work-side-menu.tsx`

Added a `useEffect` to set `open` as a JavaScript property instead of relying on the attribute:

**Before:**
```tsx
useEffect(() => {
  if (!el?.current || !onToggle) return;
  el.current?.addEventListener("_toggle", onToggle);
  return () => {
    el.current?.removeEventListener("_toggle", onToggle);
  };
}, [el, onToggle]);
```

**After:**
```tsx
useEffect(() => {
  if (!el?.current) return;
  // Set open as a property, not attribute, for proper boolean handling
  (el.current as any).open = open;
}, [open]);

useEffect(() => {
  if (!el?.current || !onToggle) return;
  const handler = () => onToggle();
  el.current?.addEventListener("_toggle", handler);
  return () => {
    el.current?.removeEventListener("_toggle", handler);
  };
}, [el, onToggle]);
```

---

## Files Modified

| File | Location | Change |
|------|----------|--------|
| `WorkSideMenu.svelte` | `ui-components/libs/web-components/src/components/work-side-menu/` | Removed `_toggle` event listener |
| `work-side-menu.tsx` | `ui-components/libs/react-components/src/experimental/work-side-menu/` | Added `useEffect` to set `open` property |

---

## Note About React 19 Upgrade

Vanessa upgraded React 18 → 19 which may have helped with some issues, but the collapse/expand toggle still wasn't working after the upgrade. The root cause was in the web component and its React wrapper (double-toggle + attribute vs property), not in React itself.

---

## Current Status

**Changes are currently applied locally** in the `vanessa/workspace` branch of `ui-components` but **not yet committed**. These need to be committed and pushed to fix the issue for everyone.

To apply these changes:
1. Make the edits to `WorkSideMenu.svelte` and `work-side-menu.tsx` as described above
2. Run `npm run build:prod` in ui-components
3. The playground will pick up the changes

---

## Testing

1. Click the "Collapse menu" / "Expand menu" button at the bottom of the side menu
2. Menu should collapse (show icons only) or expand (show icons + labels)
3. The `open` state in React should stay in sync with the visual state

---

## Commits

These changes are in the `vanessa/workspace` branch of `ui-components` and need to be committed separately from the playground repo.
