import { GoabIcon } from "@abgov/react-components";

type StatCardTint = "emergency" | "important" | "success" | "info" | undefined;

interface StatCardProps {
  value: number;
  label: string;
  icon: string;
  tint?: StatCardTint;
  onClick?: () => void;
}

const tintIconColors: Record<string, string> = {
  emergency: "var(--goa-color-emergency-default)",
  important: "var(--goa-color-important-text-dark)",
  success: "var(--goa-color-success-default)",
  info: "var(--goa-color-info-default)",
};

export function StatCard({ value, label, icon, tint, onClick }: StatCardProps) {
  const tintClass = tint ? `dashboard-stat-card--${tint}` : "";
  return (
    <div
      className={`dashboard-stat-card ${tintClass} ${onClick ? "dashboard-stat-card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="dashboard-stat-card__icon">
        <GoabIcon
          type={icon as any}
          size="medium"
          fillColor={tint ? tintIconColors[tint] : "var(--goa-color-interactive-default)"}
        />
      </div>
      <div className="dashboard-stat-card__content">
        <span
          className={`dashboard-stat-card__value ${tint ? `dashboard-stat-card__value--${tint}` : ""}`}
        >
          {value}
        </span>
        <span
          className={`dashboard-stat-card__label ${tint ? `dashboard-stat-card__label--${tint}` : ""}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
