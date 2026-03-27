import { useState, ReactNode } from "react";
import { GoabSkeleton, GoabDataGrid } from "@abgov/react-components";
import { ExpandableListItem } from "./ExpandableListItem";
import "./ExpandableListView.css";

interface ExpandableListViewProps<T> {
  data: T[];
  isLoading?: boolean;
  renderCollapsed: (item: T) => {
    title: ReactNode;
    badge?: ReactNode;
    secondaryInfo?: ReactNode;
    actions?: ReactNode;
  };
  renderExpanded: (item: T) => ReactNode;
  getRowKey: (item: T) => string;
}

export function ExpandableListView<T>({
  data,
  isLoading,
  renderCollapsed,
  renderExpanded,
  getRowKey,
}: ExpandableListViewProps<T>) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="expandable-list">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="expandable-list__item">
            <div className="expandable-list__header">
              <div className="expandable-list__toggle">
                <GoabSkeleton type="text" maxWidth="20px" />
              </div>
              <GoabSkeleton type="title" maxWidth="200px" />
              <GoabSkeleton type="text" maxWidth="80px" />
              <div className="expandable-list__secondary">
                <GoabSkeleton type="text" maxWidth="60px" />
              </div>
              <div className="expandable-list__actions">
                <GoabSkeleton type="text" maxWidth="40px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <GoabDataGrid keyboardNav="layout" keyboardIconPosition="right">
      <div className="expandable-list">
        {data.map((item) => {
          const key = getRowKey(item);
          return (
            <ExpandableListItem
              key={key}
              item={item}
              itemKey={key}
              isExpanded={expandedIds.has(key)}
              onToggle={toggleExpand}
              renderCollapsed={renderCollapsed}
              renderExpanded={renderExpanded}
            />
          );
        })}
      </div>
    </GoabDataGrid>
  );
}
