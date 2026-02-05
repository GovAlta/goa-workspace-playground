import { ReactNode } from "react";
import { GoabIcon } from "@abgov/react-components";
import { GoabxTable, GoabxBadge } from "@abgov/react-components/experimental";
import { Case } from "../../types/Case";
import { TableColumn } from "../../types/TableColumn";
import { DataTable } from "../../components/DataTable";
import { SortConfig } from "../../utils/searchUtils";
import { GoabTableOnSortDetail } from "@abgov/ui-components-common";
import { GroupedCase } from "./types";

interface CaseTableProps {
  filteredCases: Case[];
  groupedCases: GroupedCase[] | null;
  columns: TableColumn<Case>[];
  expandedGroups: Set<string>;
  onToggleGroup: (groupKey: string) => void;
  isLoading: boolean;
  emptyState?: ReactNode;
  sortConfig: SortConfig;
  onSort: (event: GoabTableOnSortDetail) => void;
  onRowClick: (caseItem: Case) => void;
  getRowKey: (caseItem: Case) => string;
  getRowSelected: (caseItem: Case) => boolean;
}

export function CaseTable({
  filteredCases,
  groupedCases,
  columns,
  expandedGroups,
  onToggleGroup,
  isLoading,
  emptyState,
  sortConfig,
  onSort,
  onRowClick,
  getRowKey,
  getRowSelected,
}: CaseTableProps) {
  if (groupedCases) {
    return (
      <div className="table-wrapper">
        <GoabxTable width="100%" variant="normal" striped={true}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.headerRender ? column.headerRender() : column.header || null}
                </th>
              ))}
            </tr>
          </thead>
          {groupedCases.map((group) => (
            <tbody key={group.key}>
              <tr
                className="table-group-row"
                onClick={() => onToggleGroup(group.key)}
                style={{ cursor: "pointer" }}
              >
                <td colSpan={columns.length}>
                  <div className="table-group-row__content">
                    <GoabIcon
                      type={
                        expandedGroups.has(group.key) ? "chevron-down" : "chevron-forward"
                      }
                      size="small"
                    />
                    <span className="table-group-row__label">{group.label}</span>
                    <GoabxBadge type="information" content={String(group.cases.length)} />
                  </div>
                </td>
              </tr>
              {expandedGroups.has(group.key) &&
                group.cases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    aria-selected={caseItem.selected ? "true" : undefined}
                    onClick={() => onRowClick(caseItem)}
                    style={{ cursor: "pointer" }}
                  >
                    {columns.map((column) => (
                      <td key={column.key}>{column.render?.(caseItem, 0)}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          ))}
        </GoabxTable>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={filteredCases}
      isLoading={isLoading}
      skeletonRows={10}
      onSort={onSort}
      sortConfig={sortConfig}
      emptyState={emptyState}
      getRowKey={getRowKey}
      getRowSelected={getRowSelected}
      onRowClick={onRowClick}
    />
  );
}
