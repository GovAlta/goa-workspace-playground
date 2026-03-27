# Workspace Template (DS 2.0)

A template for building Alberta government **workspace applications** using the GoA Design System 2.0. This template provides a starting point for internal staff-facing applications with common patterns and components already implemented.

## Tech Stack

- **React** 18.2 with TypeScript 5.3
- **Vite** 5.1 for fast development and builds
- **React Router** 6.22 for routing
- **GoA Design System 2.0** (`@abgov/react-components`, `@abgov/web-components`)
- **Vitest** for testing

## Features

- **Work Side Menu** - Responsive sidebar navigation with primary, secondary, and account sections
- **Dynamic page headers** - Sticky headers with title and action buttons
- **Data tables** - Sorting, filtering, keyboard navigation, and horizontal scroll shadows
- **Notification system** - Popover notifications with localStorage persistence
- **Loading states** - Progress indicators for async operations
- **Error boundary** - Graceful error handling with fallback UI
- **Mock API utilities** - Simulate network requests for development

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── PageHeader.tsx
│   └── ScrollContainer.tsx
├── constants/           # Shared constants
│   └── breakpoints.ts
├── contexts/            # React Context providers
│   ├── MenuContext.tsx
│   ├── NotificationContext.tsx
│   └── PageHeaderContext.tsx
├── data/                # Mock data
│   ├── mockClients.json
│   ├── mockNotifications.ts
│   └── mockSearchResults.json
├── routes/              # Page components
│   ├── ClientsPage.tsx
│   ├── SearchPage.tsx
│   └── ...
├── types/               # TypeScript interfaces
│   ├── Client.ts
│   ├── Notification.ts
│   └── SearchResult.ts
├── utils/               # Helper functions
│   ├── badgeUtils.ts
│   ├── dateUtils.ts
│   ├── mockApi.ts
│   └── searchUtils.ts
├── App.tsx              # Root layout
├── App.css              # Global styles
└── index.tsx            # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Click the green **Use this template** button
2. Select **Create a new repository**
3. Select an owner and give the repo a suitable name
4. Clone the repo onto your machine
5. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script                | Description              |
| --------------------- | ------------------------ |
| `npm run dev`         | Start development server |
| `npm run build`       | Build for production     |
| `npm run build:check` | Type-check and build     |
| `npm run preview`     | Preview production build |
| `npm run test`        | Run tests                |
| `npm run coverage`    | Run tests with coverage  |

## Key Patterns

### Loading States

Use the `mockFetch` utility to simulate API calls with loading states:

```tsx
import { mockFetch } from "../utils/mockApi";

const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    const result = await mockFetch(mockData);
    setData(result);
    setIsLoading(false);
  };
  fetchData();
}, []);

// In JSX:
<GoabCircularProgress visible={isLoading} variant="fullscreen" message="Loading..." />;
```

### Page Headers

Use the `usePageHeader` hook to set dynamic page titles and actions:

```tsx
import { usePageHeader } from "../contexts/PageHeaderContext";

usePageHeader("Page Title", <GoabButton>Action</GoabButton>);
```

### Error Handling

The app is wrapped in an `ErrorBoundary` component that catches errors and displays a fallback UI.

## Customization

### Styling

- Global styles are in `src/App.css`
- GoA Design System tokens are imported via `@abgov/web-components/index.css`
- Mobile breakpoint is set at 624px (defined in `src/constants/breakpoints.ts`)

### Adding New Pages

1. Create a new component in `src/routes/`
2. Add the route in `src/index.tsx`
3. Add a menu item in `src/App.tsx`

## Resources

- [GoA Design System 2.0](https://design.alberta.ca)
- [UI Components Documentation](https://design.alberta.ca)

## License

This template is provided by the Government of Alberta for use by Alberta government teams building internal workspace applications.
