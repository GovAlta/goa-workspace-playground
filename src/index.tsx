import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "@abgov/web-components";

// Import all page components
import { SearchPage } from './routes/SearchPage';
import { ClientsPage } from './routes/ClientsPage';
import { ClientDetailPage } from './routes/ClientDetailPage';
import { SchedulePage } from './routes/SchedulePage';
import { DocumentsPage } from './routes/DocumentsPage';
import { TeamPage } from './routes/TeamPage';
import { NotificationsPage } from './routes/NotificationsPage';
import { SupportPage } from './routes/SupportPage';
import { SettingsPage } from './routes/SettingsPage';
import { AccountPage } from './routes/AccountPage';
import { SubMenuItem1Page } from './routes/SubMenuItem1Page';
import { SubMenuItem2Page } from './routes/SubMenuItem2Page';
import { SubMenuItem3Page } from './routes/SubMenuItem3Page';
import { OverviewPage } from './routes/OverviewPage';
import { NotFoundPage } from './routes/NotFoundPage';

import App from './App';

import './App.css';
import {NotificationProvider} from "./contexts/NotificationContext";
import {NotificationAdmin} from "./routes/NotificationAdmin";
import {ErrorBoundary} from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <NotificationProvider>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Navigate to="/search" replace />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="client/:id" element={<ClientDetailPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="documents/sub1" element={<SubMenuItem1Page />} />
                    <Route path="documents/sub2" element={<SubMenuItem2Page />} />
                    <Route path="documents/sub3" element={<SubMenuItem3Page />} />
                    <Route path="team" element={<TeamPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="support" element={<SupportPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="overview" element={<OverviewPage />} />
                    <Route path="notification-admin" element={<NotificationAdmin />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </NotificationProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
);
