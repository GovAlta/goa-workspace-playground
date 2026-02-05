import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoabText, GoabBlock } from "@abgov/react-components";
import { GoabxBadge, GoabxLink } from "@abgov/react-components/experimental";
import { SearchResult } from "../../types/SearchResult";
import { TableColumn } from "../../types/TableColumn";
import mockData from "../../data/mockSearchResults.json";
import { filterData, sortData, getEventKey } from "../../utils/searchUtils";
import { getTypeBadgeProps } from "../../utils/badgeUtils";
import { PageHeader } from "../../components/PageHeader";
import { useMenu } from "../../contexts/MenuContext";
import { useMultiColumnSort } from "../../hooks/useMultiColumnSort";
import { mockFetch } from "../../utils/mockApi";
import { DataTable } from "../../components/DataTable";
import { EmptyState } from "../../components/EmptyState";
import { SearchFilters, ViewMode } from "./types";
import { SearchHeaderFilters } from "./SearchHeaderFilters";
import { SearchFilterChips } from "./SearchFilterChips";
import { SearchCardView } from "./SearchCardView";
import { SearchListView } from "./SearchListView";

export function SearchPage() {
  const [searchChips, setSearchChips] = useState<string[]>([]);
  const { sortConfig, handleTableSort, clearSort } = useMultiColumnSort();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<ViewMode>("table");

  const { isMobile } = useMenu();

  const viewMode = useMemo((): ViewMode => {
    if (isMobile && selectedView === "table") return "card";
    return selectedView;
  }, [isMobile, selectedView]);

  const [filters, setFilters] = useState<SearchFilters>({
    entity: "all",
    status: "all",
    searchText: "",
  });
  // simulate API fetch results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const data = await mockFetch<SearchResult[]>(mockData as SearchResult[]);
      setSearchResults(data);
      setIsLoading(false);
    };
    fetchResults();
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.entity !== "all") count++;
    if (filters.status !== "all") count++;
    if (filters.searchText) count++;
    count += searchChips.length;
    return count;
  }, [filters, searchChips]);

  const statusOptions = useMemo(() => {
    return [...new Set(searchResults.map((r) => r.statusText))].sort();
  }, [searchResults]);

  const filteredResults = useMemo(() => {
    let filtered = searchResults;

    if (filters.entity !== "all") {
      filtered = filtered.filter((r) => r.type === filters.entity);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((r) => r.statusText === filters.status);
    }

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.fileNumber.toLowerCase().includes(searchLower) ||
          r.staff.toLowerCase().includes(searchLower),
      );
    }

    filtered = filterData(searchChips, filtered);

    return sortData(
      filtered,
      sortConfig.primary?.key || null,
      sortConfig.primary?.direction || "none",
      sortConfig.secondary?.key || null,
      sortConfig.secondary?.direction,
    );
  }, [searchResults, filters, searchChips, sortConfig]);

  const applyFilter = useCallback(
    (valueOverride?: string) => {
      const valueToUse = valueOverride !== undefined ? valueOverride : filters.searchText;
      const trimmedValue = valueToUse.trim();
      if (trimmedValue === "") return;
      if (searchChips.includes(trimmedValue)) return;
      setSearchChips([...searchChips, trimmedValue]);
      setFilters((f) => ({ ...f, searchText: "" }));
    },
    [filters.searchText, searchChips],
  );

  const handleSearchKeywordPress = (event: any) => {
    const key = getEventKey(event);
    if (key === "Enter") {
      applyFilter(event.value);
    }
  };

  const removeChip = useCallback((chip: string) => {
    setSearchChips((prev) => prev.filter((c) => c !== chip));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchChips([]);
    setFilters({ entity: "all", status: "all", searchText: "" });
    clearSort();
  }, [clearSort]);

  const handleViewChange = useCallback((action: string) => {
    if (action === "table" || action === "card" || action === "list") {
      setSelectedView(action);
    }
  }, []);

  const searchColumns: TableColumn<SearchResult>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        type: "link",
        render: (result) => (
          <Link to={`/case/${result.id}`} className="table-row-link">
            {result.name}
          </Link>
        ),
      },
      {
        key: "status",
        header: "Status",
        type: "badge",
        sortable: true,
        render: (result) => (
          <GoabxBadge
            type={result.status}
            content={result.statusText}
            emphasis="subtle"
            icon={true}
          />
        ),
      },
      {
        key: "staff",
        header: "Staff",
        type: "text",
        render: (result) => result.staff,
      },
      {
        key: "dueDate",
        header: "Due date",
        type: "text",
        sortable: true,
        render: (result) => result.dueDate,
      },
      {
        key: "fileNumber",
        header: "File number",
        type: "text",
        render: (result) => result.fileNumber,
      },
      {
        key: "type",
        header: "Type",
        type: "badge",
        sortable: true,
        render: (result) => (
          <GoabxBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" />
        ),
      },
      {
        key: "actions",
        type: "actions",
        render: (result) => (
          <GoabxLink color="dark" mt="xs">
            <Link to={`/case/${result.id}`}>View</Link>
          </GoabxLink>
        ),
      },
    ],
    [],
  );

  const emptyStateContent = <EmptyState onButtonClick={clearAllFilters} />;

  const headerActions = (
    <SearchHeaderFilters
      filters={filters}
      setFilters={setFilters}
      onSearchKeyPress={handleSearchKeywordPress}
      statusOptions={statusOptions}
      viewMode={viewMode}
      selectedView={selectedView}
      onViewChange={handleViewChange}
    />
  );

  return (
    <>
      <PageHeader title="Search" actions={headerActions} />
      <div style={{ maxWidth: "100%", overflow: "hidden", paddingBottom: "32px" }}>
        <div className="content-padding">
          <SearchFilterChips
            filters={filters}
            searchChips={searchChips}
            onEntityClear={() => setFilters((f) => ({ ...f, entity: "all" }))}
            onStatusClear={() => setFilters((f) => ({ ...f, status: "all" }))}
            onRemoveChip={removeChip}
            onClearAll={clearAllFilters}
          />
        </div>

        {viewMode === "table" && (
          <DataTable
            columns={searchColumns}
            data={filteredResults}
            isLoading={isLoading}
            skeletonRows={10}
            onSort={handleTableSort}
            sortConfig={sortConfig}
            emptyState={
              searchResults.length > 0 && activeFiltersCount > 0
                ? emptyStateContent
                : undefined
            }
            getRowKey={(result) => result.id}
          />
        )}

        {viewMode === "card" && (
          <SearchCardView
            results={filteredResults}
            isLoading={isLoading}
            emptyState={
              searchResults.length > 0 && activeFiltersCount > 0
                ? emptyStateContent
                : undefined
            }
          />
        )}

        {viewMode === "list" && (
          <SearchListView
            results={filteredResults}
            isLoading={isLoading}
            emptyState={
              searchResults.length > 0 && activeFiltersCount > 0
                ? emptyStateContent
                : undefined
            }
          />
        )}

        {!isLoading && searchResults.length === 0 && (
          <GoabBlock mt="l" mb="l" alignment="center">
            <GoabText size="body-m" mt="none" mb="s">
              No search results available
            </GoabText>
            <GoabText size="body-s" mt="none" mb="none">
              All results have been deleted
            </GoabText>
          </GoabBlock>
        )}

        {!isLoading &&
          searchResults.length > 0 &&
          filteredResults.length === 0 &&
          activeFiltersCount === 0 && (
            <GoabBlock mt="l" mb="l" alignment="center">
              <GoabText size="body-m" mt="none" mb="s">
                Start typing to search across all records
              </GoabText>
              <GoabText size="body-s" mt="none" mb="none">
                Search cases, applications, documents, and more
              </GoabText>
            </GoabBlock>
          )}
      </div>
    </>
  );
}
