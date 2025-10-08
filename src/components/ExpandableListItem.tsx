import type { ReactNode, MouseEvent } from "react";
import { GoabIconButton } from "@abgov/react-components";

interface ExpandableListItemProps<T> {
  item: T;
  itemKey: string;
  isExpanded: boolean;
  onToggle: (key: string) => void;
  renderCollapsed: (item: T) => {
    title: ReactNode;
    badge?: ReactNode;
    secondaryInfo?: ReactNode;
    actions?: ReactNode;
  };
  renderExpanded: (item: T) => ReactNode;
}

export function ExpandableListItem<T>({
  item,
  itemKey,
  isExpanded,
  onToggle,
  renderCollapsed,
  renderExpanded,
}: ExpandableListItemProps<T>) {
  const { title, badge, secondaryInfo, actions } = renderCollapsed(item);

  const handleHeaderClick = (e: MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("a") ||
      target.closest("goa-link") ||
      target.closest("button") ||
      target.closest("goa-button") ||
      target.closest("goa-icon-button")
    ) {
      return;
    }
    onToggle(itemKey);
  };

  return (
    <div
      className={`expandable-list__item ${isExpanded ? "expandable-list__item--expanded" : ""}`}
      data-grid="row"
    >
      <div className="expandable-list__header" onClick={handleHeaderClick}>
        <GoabIconButton
          data-grid="cell-1"
          icon={isExpanded ? "chevron-down" : "chevron-forward"}
          size="small"
          variant="dark"
          ariaLabel={isExpanded ? "Collapse row" : "Expand row"}
          onClick={() => onToggle(itemKey)}
          mt="2xs"
          testId="expandable-list-toggle"
        />
        <div className="expandable-list__heading-group">
          <span className="expandable-list__title" data-grid="cell-2">
            {title}
          </span>
          <span data-grid="cell-3">{badge}</span>
        </div>
        <div className="expandable-list__right-group">
          <div className="expandable-list__secondary" data-grid="cell-4">
            {secondaryInfo}
          </div>
          <div className="expandable-list__actions" data-grid="cell-5">
            {actions}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="expandable-list__content">{renderExpanded(item)}</div>
      )}
    </div>
  );
}
