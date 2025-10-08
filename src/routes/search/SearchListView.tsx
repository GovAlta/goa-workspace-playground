import React from "react";
import { GoabBadge, GoabButton, GoabBlock } from "@abgov/react-components";
import { SearchResult } from "../../types/SearchResult";
import { getTypeBadgeProps } from "../../utils/badgeUtils";
import { ExpandableListView } from "../../components/ExpandableListView";

interface SearchListViewProps {
  results: SearchResult[];
  isLoading: boolean;
  emptyState?: React.ReactNode;
}

export function SearchListView({ results, isLoading, emptyState }: SearchListViewProps) {
  if (results.length === 0 && emptyState) {
    return <div className="content-padding">{emptyState}</div>;
  }

  return (
    <div className="content-padding">
      <ExpandableListView
        data={results}
        isLoading={isLoading}
        getRowKey={(result) => result.id}
        renderCollapsed={(result) => ({
          title: <span className="expandable-list__name">{result.name}</span>,
          badge: (
            <GoabBadge
              type={result.status}
              content={result.statusText}
              emphasis="subtle"
              icon={true}
            />
          ),
          secondaryInfo: (
            <GoabBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" />
          ),
          actions: (
            <GoabButton
              type="tertiary"
              size="compact"
              onClick={() => console.log("View result:", result.id)}
            >
              View
            </GoabButton>
          ),
        })}
        renderExpanded={(result) => (
          <div className="data-card__sections">
            <div className="data-card__section">
              <div className="data-card__section-heading">Details</div>
              <div className="data-card__section-fields">
                <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                  <span className="data-card__label">Staff</span>
                  <span className="data-card__value">{result.staff || "—"}</span>
                </GoabBlock>
                <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                  <span className="data-card__label">Due date</span>
                  <span className="data-card__value">{result.dueDate || "—"}</span>
                </GoabBlock>
                <GoabBlock direction="column" gap="xs" data-grid="cell-8">
                  <span className="data-card__label">File number</span>
                  <span className="data-card__value">{result.fileNumber || "—"}</span>
                </GoabBlock>
                <GoabBlock direction="column" gap="xs" data-grid="cell-9">
                  <span className="data-card__label">Type</span>
                  <span className="data-card__value">
                    <GoabBadge
                      {...getTypeBadgeProps(result.type)}
                      emphasis="subtle"
                      icon={true}
                    />
                  </span>
                </GoabBlock>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
