import React from "react";
import {
  GoabxInput,
  GoabxDropdown,
  GoabxDropdownItem,
  GoabxMenuAction,
  GoabxMenuButton,
} from "@abgov/react-components/experimental";
import {
  GoabIconType,
  GoabInputOnChangeDetail,
  GoabMenuButtonOnActionDetail,
} from "@abgov/ui-components-common";
import { useMenu } from "../../contexts/MenuContext";
import { SearchFilters, ViewMode } from "./types";

interface SearchHeaderFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearchKeyPress: (event: any) => void;
  statusOptions: string[];
  viewMode: ViewMode;
  selectedView: ViewMode;
  onViewChange: (action: string) => void;
}

function getViewLabel(viewMode: ViewMode): string {
  switch (viewMode) {
    case "table":
      return "Table";
    case "card":
      return "Card";
    case "list":
      return "List";
  }
}

function getViewIcon(viewMode: ViewMode): GoabIconType {
  switch (viewMode) {
    case "table":
      return "menu";
    case "card":
      return "grid";
    case "list":
      return "list";
  }
}

export function SearchHeaderFilters({
  filters,
  setFilters,
  onSearchKeyPress,
  statusOptions,
  viewMode,
  selectedView,
  onViewChange,
}: SearchHeaderFiltersProps) {
  const { isMobile } = useMenu();

  return (
    <div className="search-header-filters">
      <div className="search-header-filters__search">
        <GoabxInput
          name="searchText"
          value={filters.searchText}
          onChange={(e: GoabInputOnChangeDetail) =>
            setFilters((f) => ({ ...f, searchText: e.value }))
          }
          onKeyPress={onSearchKeyPress}
          placeholder={
            isMobile ? "Search..." : "Search by name, staff, or file number..."
          }
          leadingIcon="search"
          size="compact"
          width="100%"
        />
      </div>

      <div className="search-header-filters__dropdowns">
        <GoabxDropdown
          value={filters.entity}
          onChange={(e) => setFilters((f) => ({ ...f, entity: e.value }))}
          placeholder="All types"
          size="compact"
          width="120px"
        >
          <GoabxDropdownItem value="all" label="All types" />
          <GoabxDropdownItem value="client" label="Clients" />
          <GoabxDropdownItem value="case" label="Cases" />
          <GoabxDropdownItem value="application" label="Applications" />
          <GoabxDropdownItem value="document" label="Documents" />
        </GoabxDropdown>

        <GoabxDropdown
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.value }))}
          placeholder="All statuses"
          size="compact"
          width="150px"
          maxHeight="70vh"
        >
          <GoabxDropdownItem value="all" label="All statuses" />
          {statusOptions.map((status) => (
            <GoabxDropdownItem key={status} value={status} label={status} />
          ))}
        </GoabxDropdown>

        <GoabxMenuButton
          size="compact"
          type="tertiary"
          leadingIcon={getViewIcon(viewMode)}
          text={getViewLabel(viewMode)}
          onAction={(e: GoabMenuButtonOnActionDetail) => onViewChange(e.action)}
        >
          <GoabxMenuAction
            text="Table"
            action="table"
            icon={selectedView === "table" ? "checkmark" : undefined}
          />
          <GoabxMenuAction
            text="Card"
            action="card"
            icon={selectedView === "card" ? "checkmark" : undefined}
          />
          <GoabxMenuAction
            text="List"
            action="list"
            icon={selectedView === "list" ? "checkmark" : undefined}
          />
        </GoabxMenuButton>
      </div>
    </div>
  );
}
