import { ReactNode } from "react";
import {
  GoabIcon,
  GoabBadge,
  GoabLink,
  GoabButton,
  GoabBlock,
} from "@abgov/react-components";
import { ExpandableListView } from "../../components/ExpandableListView";
import { Case } from "../../types/Case";
import { GroupedCase } from "./types";

interface CaseListViewProps {
  filteredCases: Case[];
  groupedCases: GroupedCase[] | null;
  expandedGroups: Set<string>;
  onToggleGroup: (groupKey: string) => void;
  isLoading: boolean;
  emptyState?: ReactNode;
  onMenuAction: (action: string, caseId: string) => void;
}

function renderCaseCollapsed(
  caseItem: Case,
  onMenuAction: (action: string, caseId: string) => void,
) {
  return {
    title: <span className="expandable-list__name">{caseItem.name}</span>,
    badge: <GoabBadge type={caseItem.status} content={caseItem.statusText} icon={true} />,
    secondaryInfo: (
      <div className="expandable-list__header-actions">
        {caseItem.comments > 0 && (
          <GoabLink leadingIcon="chatbox" size="small">
            <a href="#">
              {caseItem.comments} comment{caseItem.comments === 1 ? "" : "s"}
            </a>
          </GoabLink>
        )}
      </div>
    ),
    actions: (
      <GoabButton
        type="tertiary"
        size="compact"
        onClick={() => onMenuAction("view", caseItem.id)}
      >
        View
      </GoabButton>
    ),
  };
}

function renderCaseExpanded(caseItem: Case) {
  return (
    <div className="data-card__sections">
      <div className="data-card__section">
        <div className="data-card__section-heading">Identification</div>
        <div className="data-card__section-fields">
          <GoabBlock direction="column" gap="xs">
            <span className="data-card__label">File number</span>
            <span className="data-card__value">{caseItem.fileNumber || "—"}</span>
          </GoabBlock>
          <GoabBlock direction="column" gap="xs">
            <span className="data-card__label">Jurisdiction</span>
            <span className="data-card__value">{caseItem.jurisdiction || "—"}</span>
          </GoabBlock>
        </div>
      </div>
      <div className="data-card__section">
        <div className="data-card__section-heading">Assignment</div>
        <div className="data-card__section-fields">
          <GoabBlock direction="column" gap="xs">
            <span className="data-card__label">Assigned to</span>
            <span className="data-card__value">{caseItem.staff || "—"}</span>
          </GoabBlock>
          <GoabBlock direction="column" gap="xs">
            <span className="data-card__label">Due date</span>
            <span className="data-card__value">{caseItem.dueDate || "—"}</span>
          </GoabBlock>
          <GoabBlock direction="column" gap="xs">
            <span className="data-card__label">Category</span>
            <span className="data-card__value">
              {caseItem.category === "todo"
                ? "To do"
                : caseItem.category === "progress"
                  ? "In progress"
                  : caseItem.category === "complete"
                    ? "Complete"
                    : caseItem.category || "—"}
            </span>
          </GoabBlock>
        </div>
      </div>
    </div>
  );
}

export function CaseListView({
  filteredCases,
  groupedCases,
  expandedGroups,
  onToggleGroup,
  isLoading,
  emptyState,
  onMenuAction,
}: CaseListViewProps) {
  if (filteredCases.length === 0 && emptyState) {
    return <div className="content-padding">{emptyState}</div>;
  }

  if (groupedCases) {
    // Grouped list view
    return (
      <div className="content-padding">
        <div className="cases-grouped-view">
          {groupedCases.map((group) => (
            <div key={group.key} className="cases-group">
              <button
                className="cases-group__header"
                onClick={() => onToggleGroup(group.key)}
                aria-expanded={expandedGroups.has(group.key)}
              >
                <GoabIcon
                  type={
                    expandedGroups.has(group.key) ? "chevron-down" : "chevron-forward"
                  }
                  size="small"
                />
                <span className="cases-group__label">{group.label}</span>
                <GoabBadge type="information" content={String(group.cases.length)} />
              </button>
              {expandedGroups.has(group.key) && (
                <div className="cases-group__list">
                  <ExpandableListView
                    data={group.cases}
                    isLoading={isLoading}
                    getRowKey={(caseItem) => caseItem.id}
                    renderCollapsed={(caseItem) =>
                      renderCaseCollapsed(caseItem, onMenuAction)
                    }
                    renderExpanded={renderCaseExpanded}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Flat list view
  return (
    <div className="content-padding">
      <ExpandableListView
        data={filteredCases}
        isLoading={isLoading}
        getRowKey={(caseItem) => caseItem.id}
        renderCollapsed={(caseItem) => renderCaseCollapsed(caseItem, onMenuAction)}
        renderExpanded={renderCaseExpanded}
      />
    </div>
  );
}
