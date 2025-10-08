import { Link } from "react-router-dom";
import { GoabIcon } from "@abgov/react-components";
import { ActivityItem } from "./types";
import { formatRelativeTime } from "../../utils/dateUtils";

interface ActivityItemComponentProps {
  item: ActivityItem;
}

export function ActivityItemComponent({ item }: ActivityItemComponentProps) {
  return (
    <Link to={`/case/${item.caseId}`} className="dashboard-activity-item">
      <div className="dashboard-activity-item__icon">
        <GoabIcon
          type={item.icon as any}
          size="small"
          fillColor="var(--goa-color-text-secondary)"
        />
      </div>
      <div className="dashboard-activity-item__content">
        <span className="dashboard-activity-item__time">
          {formatRelativeTime(item.timestamp)}
        </span>
        <span className="dashboard-activity-item__action">{item.action}</span>
        <span className="dashboard-activity-item__case">{item.caseName}</span>
      </div>
    </Link>
  );
}
