import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GoabText, GoabGrid } from "@abgov/react-components";
import { GoabxButton } from "@abgov/react-components/experimental";
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
import { PageHeader } from "../../components/PageHeader";
import { useMenu } from "../../contexts/MenuContext";
import { Case } from "../../types/Case";
import {
  parseDate,
  formatDate,
  formatShortDate,
  formatDueDate,
} from "../../utils/dateUtils";
import { ActivityItem } from "./types";
import { StatCard } from "./StatCard";
import { Widget } from "./Widget";
import { WorkQueueCard } from "./WorkQueueCard";
import { ComingUpItem } from "./ComingUpItem";
import { ActivityItemComponent } from "./ActivityItem";
import mockCases from "../../data/mockCases.json";
import mockActivity from "../../data/mockActivity.json";
import mockChartData from "../../data/mockChartData.json";
import "./DashboardPage.css";

// GoA Design System extended palette colors for charts (adjusted for contrast)
// Based on: --goa-color-extended-{name} tokens
const GOA_CHART_COLORS = {
  lilac: "#be8cfb", // extended-lilac (new cases)
  pasture: "#8ac340", // extended-pasture (completed)
  sunset: "#f0963e", // extended-sunset (updated)
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { isMobile } = useMenu();
  const cases = mockCases as Case[];
  const activity = mockActivity as ActivityItem[];

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

  const workQueue = useMemo(() => {
    const today = new Date();
    const myCases = cases.filter(
      (c) => c.staff === "Edna Mode" && c.category !== "complete",
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

  const handleStatClick = (filter: string) => {
    navigate(`/cases?filter=${filter}`);
  };

  return (
    <>
      {isMobile && (
        <PageHeader
          title="Overview"
          actions={
            <span className="dashboard-header-date">{formatShortDate(new Date())}</span>
          }
        />
      )}
      <div className="dashboard-page">
        <div className="dashboard-greeting">
          <div className="dashboard-greeting__content">
            <GoabText
              size={isMobile ? "heading-s" : "heading-m"}
              mt="none"
              mb="none"
              color={isMobile ? "secondary" : undefined}
            >
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

        <div className="dashboard-main">
          <div className="dashboard-main__left">
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
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
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

            <Widget
              title="My Work Queue"
              action={
                <GoabxButton
                  type="tertiary"
                  size="compact"
                  onClick={() => navigate("/cases?filter=my-cases")}
                >
                  View all
                </GoabxButton>
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

          <div className="dashboard-main__right">
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

            <Widget
              title="Recent Activity"
              action={
                <GoabxButton
                  type="tertiary"
                  size="compact"
                  onClick={() => navigate("/notifications")}
                >
                  View all
                </GoabxButton>
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
    </>
  );
}
