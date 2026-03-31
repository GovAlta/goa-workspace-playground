import { Link } from "react-router-dom";
import { GoabBadge } from "@abgov/react-components";
import { getPriorityBadgeProps } from "../../utils/badgeUtils";
import { Case } from "../../types/Case";

interface WorkQueueCardProps {
  caseItem: Case;
  isOverdue: boolean;
}

export function WorkQueueCard({ caseItem, isOverdue }: WorkQueueCardProps) {
  return (
    <Link to={`/case/${caseItem.id}`} className="dashboard-queue-card">
      <div className="dashboard-queue-card__main">
        <div className="dashboard-queue-card__header">
          <span className="dashboard-queue-card__name">{caseItem.name}</span>
          <span
            className={`dashboard-queue-card__date ${isOverdue ? "dashboard-queue-card__date--overdue" : ""}`}
          >
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
