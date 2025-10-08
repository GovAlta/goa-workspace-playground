import React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "@abgov/web-components";

// Import all page components
import { DashboardPage } from "./routes/dashboard";
import { SearchPage } from "./routes/search";
import { CasesPage, CaseDetailPage } from "./routes/cases";
import { SchedulePage } from "./routes/SchedulePage";
import { TeamPage } from "./routes/TeamPage";
import { SupportPage } from "./routes/SupportPage";
import { SettingsPage } from "./routes/SettingsPage";
import { AccountPage } from "./routes/AccountPage";
import { SubMenuItem1Page } from "./routes/SubMenuItem1Page";
import { SubMenuItem2Page } from "./routes/SubMenuItem2Page";
import { SubMenuItem3Page } from "./routes/SubMenuItem3Page";
import { NotFoundPage } from "./routes/NotFoundPage";
import { UnauthorizedPage } from "./routes/UnauthorizedPage";
import { ServerErrorPage } from "./routes/ServerErrorPage";
import { LogoutPage } from "./routes/LogoutPage";

import App from "./App";

import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<DashboardPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="case/:id" element={<CaseDetailPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="documents/sub1" element={<SubMenuItem1Page />} />
            <Route path="documents/sub2" element={<SubMenuItem2Page />} />
            <Route path="documents/sub3" element={<SubMenuItem3Page />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="401" element={<UnauthorizedPage />} />
            <Route path="500" element={<ServerErrorPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
);
