import { Link } from "react-router-dom";
import { Case } from "../../types/Case";

interface ComingUpItemProps {
  caseItem: Case;
  relativeDate: string;
}

export function ComingUpItem({ caseItem, relativeDate }: ComingUpItemProps) {
  return (
    <Link to={`/case/${caseItem.id}`} className="dashboard-coming-up-item">
      <span className="dashboard-coming-up-item__date">{relativeDate}</span>
      <span className="dashboard-coming-up-item__name">{caseItem.name}</span>
    </Link>
  );
}
