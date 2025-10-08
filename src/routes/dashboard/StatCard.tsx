import { GoabIcon } from "@abgov/react-components";

interface StatCardProps {
  value: number;
  label: string;
  icon: string;
  highlight?: boolean;
  onClick?: () => void;
}

export function StatCard({ value, label, icon, highlight, onClick }: StatCardProps) {
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
          fillColor={
            highlight
              ? "var(--goa-color-emergency-text-dark)"
              : "var(--goa-color-interactive-default)"
          }
        />
      </div>
      <div className="dashboard-stat-card__content">
        <span
          className={`dashboard-stat-card__value ${highlight ? "dashboard-stat-card__value--highlight" : ""}`}
        >
          {value}
        </span>
        <span className="dashboard-stat-card__label">{label}</span>
      </div>
    </div>
  );
}
