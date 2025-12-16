import React, { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GoabText,
  GoabButton,
  GoabBadge,
  GoabIcon,
  GoabGrid,
} from "@abgov/react-components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePageHeader } from "../contexts/PageHeaderContext";
import { useMenu } from "../contexts/MenuContext";
import { getPriorityBadgeProps } from "../utils/badgeUtils";
import { Case } from "../types/Case";
import mockCases from "../data/mockCases.json";
import mockActivity from "../data/mockActivity.json";
import mockChartData from "../data/mockChartData.json";
import "./DashboardPage.css";

// Type for activity items
interface ActivityItem {
  id: string;
  timestamp: string;
  action: string;
  caseId: string;
  caseName: string;
  icon: string;
}

// GoA Design System extended palette colors for charts
// These map to: --goa-color-extended-{name}-default tokens
const GOA_CHART_COLORS = {
  lilac: "#d4c2ff",    // extended-lilac-default (new cases)
  pasture: "#afe274",  // extended-pasture-default (completed)
  sunset: "#f7ac71",   // extended-sunset-default (updated)
};

// Get time-aware greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Format date for header
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format short date for mobile header
function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Format relative time for activity feed
function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) {
    return date.toLocaleTimeString("en-CA", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// Parse date string from mock data (e.g., "Mar 16, 2024")
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Format relative due date
function formatDueDate(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return "No date";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((dueDay.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays <= 14) return "Next week";
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// Stat Card component
interface StatCardProps {
  value: number;
  label: string;
  icon: string;
  highlight?: boolean;
  onClick?: () => void;
}

function StatCard({ value, label, icon, highlight, onClick }: StatCardProps) {
  return (
    <div
      className={`dashboard-stat-card ${highlight ? "dashboard-stat-card--highlight" : ""} ${onClick ? "dashboard-stat-card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="dashboard-stat-card__icon">
        <GoabIcon
          type={icon as any}
          size="medium"
          fillColor={highlight ? "var(--goa-color-emergency-text-dark)" : "var(--goa-color-interactive-default)"}
        />
      </div>
      <div className="dashboard-stat-card__content">
        <span className={`dashboard-stat-card__value ${highlight ? "dashboard-stat-card__value--highlight" : ""}`}>
          {value}
        </span>
        <span className="dashboard-stat-card__label">{label}</span>
      </div>
    </div>
  );
}

// Dashboard Widget wrapper
interface WidgetProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function Widget({ title, action, children }: WidgetProps) {
  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget__header">
        <GoabText size="heading-xs" mt="none" mb="none">
          {title}
        </GoabText>
        {action}
      </div>
      <div className="dashboard-widget__content">{children}</div>
    </div>
  );
}

// Work Queue Card
interface WorkQueueCardProps {
  caseItem: Case;
  isOverdue: boolean;
}

function WorkQueueCard({ caseItem, isOverdue }: WorkQueueCardProps) {
  return (
    <Link to={`/case/${caseItem.id}`} className="dashboard-queue-card">
      <div className="dashboard-queue-card__main">
        <div className="dashboard-queue-card__header">
          <span className="dashboard-queue-card__name">{caseItem.name}</span>
          <span className={`dashboard-queue-card__date ${isOverdue ? "dashboard-queue-card__date--overdue" : ""}`}>
            {isOverdue ? "OVERDUE" : caseItem.dueDate || "No date"}
          </span>
        </div>
        <div className="dashboard-queue-card__badges">
          {caseItem.priority && (
            <GoabBadge {...getPriorityBadgeProps(caseItem.priority)} />
          )}
          <GoabBadge
            type={caseItem.status}
            content={caseItem.statusText}
            emphasis="subtle"
            icon={true}
          />
        </div>
      </div>
    </Link>
  );
}

// Coming Up Item
interface ComingUpItemProps {
  caseItem: Case;
  relativeDate: string;
}

function ComingUpItem({ caseItem, relativeDate }: ComingUpItemProps) {
  return (
    <Link to={`/case/${caseItem.id}`} className="dashboard-coming-up-item">
      <span className="dashboard-coming-up-item__date">{relativeDate}</span>
      <span className="dashboard-coming-up-item__name">{caseItem.name}</span>
    </Link>
  );
}

// Activity Item
interface ActivityItemComponentProps {
  item: ActivityItem;
}

function ActivityItemComponent({ item }: ActivityItemComponentProps) {
  return (
    <Link to={`/case/${item.caseId}`} className="dashboard-activity-item">
      <div className="dashboard-activity-item__icon">
        <GoabIcon type={item.icon as any} size="small" fillColor="var(--goa-color-text-secondary)" />
      </div>
      <div className="dashboard-activity-item__content">
        <span className="dashboard-activity-item__time">{formatRelativeTime(item.timestamp)}</span>
        <span className="dashboard-activity-item__action">{item.action}</span>
        <span className="dashboard-activity-item__case">{item.caseName}</span>
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { isMobile } = useMenu();
  const cases = mockCases as Case[];
  const activity = mockActivity as ActivityItem[];

  // Calculate stats from mock data
  const stats = useMemo(() => {
    const today = new Date();
    const myCases = cases.filter((c) => c.staff === "Edna Mode");
    const overdue = myCases.filter((c) => {
      const dueDate = parseDate(c.dueDate);
      return dueDate && dueDate < today;
    });
    const dueSoon = myCases.filter((c) => {
      const dueDate = parseDate(c.dueDate);
      if (!dueDate) return false;
      const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);
      return diffDays >= 0 && diffDays <= 7;
    });
    const completed = myCases.filter((c) => c.category === "complete");

    return {
      myCases: myCases.length,
      overdue: overdue.length,
      dueSoon: dueSoon.length,
      completed: completed.length,
    };
  }, [cases]);

  // Get work queue (my cases sorted by due date, overdue first)
  const workQueue = useMemo(() => {
    const today = new Date();
    const myCases = cases.filter(
      (c) => c.staff === "Edna Mode" && c.category !== "complete"
    );

    return myCases
      .map((c) => ({
        ...c,
        isOverdue: (() => {
          const dueDate = parseDate(c.dueDate);
          return dueDate ? dueDate < today : false;
        })(),
      }))
      .sort((a, b) => {
        // Overdue cases first
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        // Then by due date
        const dateA = parseDate(a.dueDate);
        const dateB = parseDate(b.dueDate);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }, [cases]);

  // Get coming up items (next 5 deadlines)
  const comingUp = useMemo(() => {
    const today = new Date();
    return cases
      .filter((c) => {
        const dueDate = parseDate(c.dueDate);
        return dueDate && dueDate >= today && c.staff === "Edna Mode";
      })
      .sort((a, b) => {
        const dateA = parseDate(a.dueDate)!;
        const dateB = parseDate(b.dueDate)!;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5)
      .map((c) => ({
        ...c,
        relativeDate: formatDueDate(c.dueDate),
      }));
  }, [cases]);

  // On mobile, show title with date in sticky header; on desktop, no header
  usePageHeader(
    isMobile ? "Overview" : "",
    isMobile ? {
      actions: <span style={{ font: "var(--goa-typography-body-s)", color: "var(--goa-color-text-secondary)" }}>{formatShortDate(new Date())}</span>
    } : undefined
  );

  // Handle stat card clicks - navigate to Cases with filter
  const handleStatClick = (filter: string) => {
    navigate(`/cases?filter=${filter}`);
  };

  return (
    <div className="dashboard-page">
      {/* Personalized Greeting */}
      <div className="dashboard-greeting">
        <div className="dashboard-greeting__content">
          <GoabText size={isMobile ? "heading-s" : "heading-m"} mt="none" mb="none">
            {getGreeting()}, Edna
          </GoabText>
{!isMobile && (
            <span className="dashboard-greeting__subtitle">
              Here's your workload overview
            </span>
          )}
        </div>
        {!isMobile && (
          <span className="dashboard-greeting__date">{formatDate(new Date())}</span>
        )}
      </div>

      {/* Stats Row */}
      {isMobile ? (
        <div className="dashboard-stats-grid">
          <StatCard
            value={stats.myCases}
            label="My Active Cases"
            icon="briefcase"
            onClick={() => handleStatClick("my-cases")}
          />
          <StatCard
            value={stats.overdue}
            label="Overdue"
            icon="warning"
            highlight={stats.overdue > 0}
            onClick={() => handleStatClick("overdue")}
          />
          <StatCard
            value={stats.dueSoon}
            label="Due This Week"
            icon="calendar"
            onClick={() => handleStatClick("due-soon")}
          />
          <StatCard
            value={stats.completed}
            label="Completed"
            icon="checkmark-circle"
            onClick={() => handleStatClick("completed")}
          />
        </div>
      ) : (
        <GoabGrid minChildWidth="180px" gap="m">
          <StatCard
            value={stats.myCases}
            label="My Active Cases"
            icon="briefcase"
            onClick={() => handleStatClick("my-cases")}
          />
          <StatCard
            value={stats.overdue}
            label="Overdue"
            icon="warning"
            highlight={stats.overdue > 0}
            onClick={() => handleStatClick("overdue")}
          />
          <StatCard
            value={stats.dueSoon}
            label="Due This Week"
            icon="calendar"
            onClick={() => handleStatClick("due-soon")}
          />
          <StatCard
            value={stats.completed}
            label="Completed"
            icon="checkmark-circle"
            onClick={() => handleStatClick("completed")}
          />
        </GoabGrid>
      )}

      {/* Two-Column Main Content */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-main__left">
          {/* Case Activity Chart */}
          <Widget title="Case Activity (Last 7 Days)">
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={mockChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={{ stroke: "#e5e5e5" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={{ stroke: "#e5e5e5" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e5e5",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="newCases"
                    name="New"
                    stroke={GOA_CHART_COLORS.lilac}
                    fill={GOA_CHART_COLORS.lilac}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke={GOA_CHART_COLORS.pasture}
                    fill={GOA_CHART_COLORS.pasture}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="updated"
                    name="Updated"
                    stroke={GOA_CHART_COLORS.sunset}
                    fill={GOA_CHART_COLORS.sunset}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Widget>

          {/* My Work Queue */}
          <Widget
            title="My Work Queue"
            action={
              <GoabButton
                type="tertiary"
                size="compact"
                onClick={() => navigate("/cases?filter=my-cases")}
              >
                View all
              </GoabButton>
            }
          >
            <div className="dashboard-queue">
              {workQueue.length === 0 ? (
                <p className="dashboard-empty">No cases assigned to you</p>
              ) : (
                workQueue.map((caseItem) => (
                  <WorkQueueCard
                    key={caseItem.id}
                    caseItem={caseItem}
                    isOverdue={caseItem.isOverdue}
                  />
                ))
              )}
            </div>
          </Widget>
        </div>

        {/* Right Column */}
        <div className="dashboard-main__right">
          {/* Coming Up */}
          <Widget title="Coming Up">
            <div className="dashboard-coming-up">
              {comingUp.length === 0 ? (
                <p className="dashboard-empty">No upcoming deadlines</p>
              ) : (
                comingUp.map((item) => (
                  <ComingUpItem
                    key={item.id}
                    caseItem={item}
                    relativeDate={item.relativeDate}
                  />
                ))
              )}
            </div>
          </Widget>

          {/* Recent Activity */}
          <Widget
            title="Recent Activity"
            action={
              <GoabButton
                type="tertiary"
                size="compact"
                onClick={() => navigate("/notifications")}
              >
                View all
              </GoabButton>
            }
          >
            <div className="dashboard-activity">
              {activity.length === 0 ? (
                <p className="dashboard-empty">No recent activity</p>
              ) : (
                activity.map((item) => (
                  <ActivityItemComponent key={item.id} item={item} />
                ))
              )}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
}
