# Session: Error Pages (401, 500) and Reusable ErrorPage Component

**Date**: November 28, 2025

## Summary

Created a reusable ErrorPage component and added 401 (Unauthorized) and 500 (Server Error) pages alongside the existing 404 page. All three error pages share the same layout and styling, differing only in content.

---

## Changes Made

### Reusable ErrorPage Component

Created `src/components/ErrorPage.tsx` with configurable props:
- `icon` - GoabIcon type (all pages use "warning")
- `errorCode` - Display text (e.g., "Error 404")
- `heading` - Main heading text
- `description` - Description paragraph
- `buttonText` / `buttonLink` - Action button configuration

### Error Pages

| Page | Route | Heading | Description |
|------|-------|---------|-------------|
| NotFoundPage | `/*` (catch-all) | The page you are looking for does not exist | We could not find the page you are looking for. Please check the URL and try again. We apologize for the inconvenience. |
| UnauthorizedPage | `/401` | Restricted access | We cannot provide access to this page without valid credentials. Please log in or contact support at cs.licensingsupport@gov.ab.ca to request access. We apologize for the inconvenience. |
| ServerErrorPage | `/500` | We are experiencing a problem | We are experiencing an issue trying to load this page. Please try again in a few minutes. We apologize for the inconvenience. |

### CSS Updates

Renamed classes from `.not-found-*` to `.error-page-*` for reuse:
- `.error-page` - Main container with responsive padding
- `.error-page-content` - Flexbox column layout, centered
- `.error-page-icon-wrapper` - 120px circular grey background
- `.error-page-underline` - 110px blue brand underline

---

## Files Created

- `src/components/ErrorPage.tsx` - Reusable error page component
- `src/routes/UnauthorizedPage.tsx` - 401 error page
- `src/routes/ServerErrorPage.tsx` - 500 error page

## Files Modified

- `src/routes/NotFoundPage.tsx` - Refactored to use ErrorPage component
- `src/index.tsx` - Added routes for `/401` and `/500`
- `src/App.css` - Renamed `.not-found-*` to `.error-page-*`

---

## Commits

```
e2e64be Add reusable ErrorPage component with 401 and 500 error pages
fe184a0 Add url prop to side menu items for active state detection
1d26041 Show PageHeader on mobile even without title
baed2fd Improve ClientsPage table and filter drawer
```

---

## Testing

- `/401` - Displays unauthorized/restricted access page
- `/500` - Displays server error page
- `/anything-invalid` - Displays 404 page
- All pages show menu button on mobile
