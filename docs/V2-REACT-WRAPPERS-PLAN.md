# Plan: Add version="2" to React Component Wrappers (Playground Scope)

## Goal
Update the React component wrappers in `ui-components` to pass `version="2"` to their underlying web components, so components used in the playground render with V2 styling.

---

## Proof of Concept: GoabInput (COMPLETED)

Successfully updated the Input component as a proof of concept. Here's exactly what was done:

### Changes Made to `input/input.tsx`

**1. Added `version?: string;` and `size?: string;` to WCProps interface (lines 44, 52):**
```typescript
interface WCProps extends Margins {
  // ... existing props ...
  textalign?: string;
  size?: string;        // NEW - for compact size support
  // ...
  version?: string;     // NEW - for V2 support
}
```

**2. Added `size?: "compact";` to BaseProps interface (line 93):**
```typescript
interface BaseProps extends Margins, DataGridProps {
  // ... existing props ...
  textAlign?: "left" | "right";
  size?: "compact";     // NEW - exposes compact size to React users
}
```

**3. Added `size` to destructuring (line 168):**
```typescript
const [dataGridProps, {
  // ... existing props ...
  textAlign = "left",
  size,                 // NEW
  onTrailingIconClick,
  // ...
}] = useDataGridProps(props);
```

**4. Added `size={size}` and `version={"2"}` to JSX (lines 254-255):**
```typescript
<goa-input
  // ... existing props ...
  textalign={textAlign}
  size={size}           // NEW
  version={"2"}         // NEW
  {...dataGridProps}
>
```

### Verification
- Rebuilt ui-components: `npm run build:prod`
- Tested in playground at http://localhost:5174/clients
- Input renders with V2 styling
- `size="compact"` works correctly
- All event handlers (onChange, onKeyPress) work as expected

---

## Approach for Remaining Components

The pattern is simple and consistent:

1. **Add `version?: string;` to the WCProps interface** (internal interface for web component)
2. **Add `version={"2"}` to the JSX** where the `<goa-xxx>` element is rendered

No changes needed to public `GoabXxxProps` interfaces or utilities (unless adding new props like `size`).

---

## Components Status

### Already have version="2" (skip these - 9 components):
- [x] button
- [x] checkbox
- [x] filter-chip
- [x] form-item
- [x] icon-button
- [x] link
- [x] modal
- [x] table
- [x] table-sort-header

### Completed (1 component):
- [x] **input** (proof of concept - also added `size` prop)

### Need version="2" added (10 remaining):
- [ ] badge
- [ ] block
- [ ] button-group
- [ ] data-grid
- [ ] dropdown (+ dropdown-item if separate)
- [ ] page-block
- [ ] radio-group (+ radio-item if separate)
- [ ] tab
- [ ] tabs
- [ ] text

---

## Files to Modify

```
ui-components/libs/react-components/src/lib/
├── badge/badge.tsx
├── block/block.tsx
├── button-group/button-group.tsx
├── data-grid/data-grid.tsx
├── dropdown/dropdown.tsx
├── dropdown/dropdown-item.tsx (if exists)
├── page-block/page-block.tsx
├── radio-group/radio-group.tsx
├── radio-group/radio-item.tsx (if exists)
├── tab/tab.tsx
├── tabs/tabs.tsx
└── text/text.tsx
```

---

## Implementation Steps (for each component)

1. Open the component's `.tsx` file
2. Find `interface WCProps` and add `version?: string;`
3. Find the `<goa-xxx` JSX element and add `version={"2"}`
4. After all components updated, rebuild: `npm run build:prod`
5. Test in playground at http://localhost:5174/

---

## Build Command

```bash
cd /Users/tom/Projects/Design-system/ui-components
npm run build:prod
```

Note: Angular build may fail (known issue) but React components will build successfully.

---

## Testing

After rebuild, the playground at http://localhost:5174/ should automatically pick up changes via HMR. Test:
- /clients - has most components (table, input, buttons, tabs, badges, etc.)
- /search - similar to clients page
- Other pages as needed

---

## Session Notes (Nov 25, 2025)

### Dev Server
- Playground running at http://localhost:5174/ (port 5173 was in use)
- Start command: `cd /Users/tom/Projects/Design-system/goa-workspace-playground && npm run dev`

### Recent Changes to Playground
1. **Fixed horizontal scroll** - Only the table scrolls horizontally now, not the tabs/filters
   - Changed `App.tsx` desktop-card-container to `overflow: "auto"`
   - Added `overflow: hidden` to ClientsPage wrapper
   - ScrollContainer has its own `overflow-x: auto`

2. **Made components compact** - Header buttons, filter button, and search input are all `size="compact"`

3. **Input V2 working** - GoabInput now uses version="2" with compact size support

### Branch Info
- ui-components: `vanessa/workspace` branch
- design-tokens: `vanessa/workspace` branch (remote: `originGOVAB`)
- playground: `main` branch

### Next Steps
Update remaining 10 React wrappers with `version="2"`:
- badge, block, button-group, data-grid, dropdown, page-block, radio-group, tab, tabs, text

---

## Session Notes

See `session-2025-11-26-v2-react-wrappers.md` for Nov 26, 2025 session notes.
