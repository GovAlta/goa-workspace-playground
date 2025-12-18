import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GoabText,
  GoabInput,
  GoabButton,
  GoabFilterChip,
  GoabBadge,
  GoabBlock,
  GoabIcon,
  GoabDropdown,
  GoabDropdownItem,
  GoabContainer,
  GoabSkeleton,
  GoabDataGrid,
  GoabLink,
  GoabMenuButton,
  GoabMenuAction,
} from "@abgov/react-components";
import { SearchResult } from "../types/SearchResult";
import { TableColumn } from "../types/TableColumn";
import mockData from "../data/mockSearchResults.json";
import { filterData, sortData, getEventKey } from "../utils/searchUtils";
import { getTypeBadgeProps } from "../utils/badgeUtils";
import { GoabInputOnChangeDetail, GoabMenuButtonOnActionDetail } from "@abgov/ui-components-common";
import { usePageHeader } from "../contexts/PageHeaderContext";
import { useMenu } from "../contexts/MenuContext";
import { useTwoLevelSort } from "../hooks/useTwoLevelSort";
import { mockFetch } from "../utils/mockApi";
import { DataTable } from "../components/DataTable";
import { ExpandableListView } from "../components/ExpandableListView";
import { EmptyState } from "../components/EmptyState";

// Filter state structure
interface SearchFilters {
  entity: string;      // 'all' | 'case' | 'application' | 'document'
  status: string;      // 'all' | specific status values
  searchText: string;  // Free text search
}

type ViewMode = 'table' | 'card' | 'list';

export function SearchPage() {
  const [typedChips, setTypedChips] = useState<string[]>([]);
  const { sortConfig, handleTableSort, clearSort } = useTwoLevelSort();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<ViewMode>('table');

  // Get mobile state from MenuContext
  const { isMobile } = useMenu();

  // Compute view mode based on selected view and mobile state
  // On mobile, table becomes card automatically
  const viewMode = useMemo((): ViewMode => {
    if (isMobile && selectedView === 'table') return 'card';
    return selectedView;
  }, [isMobile, selectedView]);

  // Enhanced filter state
  const [filters, setFilters] = useState<SearchFilters>({
    entity: 'all',
    status: 'all',
    searchText: '',
  });

  // Simulate fetching search results from an API
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const data = await mockFetch<SearchResult[]>(mockData as SearchResult[]);
      setSearchResults(data);
      setIsLoading(false);
    };
    fetchResults();
  }, []);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.entity !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.searchText) count++;
    count += typedChips.length;
    return count;
  }, [filters, typedChips]);

  // Extract unique statuses from data
  const statusOptions = useMemo(() => {
    const statuses = [...new Set(searchResults.map(r => r.statusText))].sort();
    return statuses;
  }, [searchResults]);

  // Filter results based on all filter criteria
  const filteredResults = useMemo(() => {
    let filtered = searchResults;

    // Apply entity filter
    if (filters.entity !== 'all') {
      filtered = filtered.filter(r => r.type === filters.entity);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.statusText === filters.status);
    }

    // Apply text search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchLower) ||
        r.fileNumber.toLowerCase().includes(searchLower) ||
        r.staff.toLowerCase().includes(searchLower)
      );
    }

    // Apply typed chips (legacy search)
    filtered = filterData(typedChips, filtered);

    // Apply two-level sorting
    return sortData(
      filtered,
      sortConfig.primary?.key || null,
      sortConfig.primary?.direction || 'none',
      sortConfig.secondary?.key || null,
      sortConfig.secondary?.direction
    );
  }, [searchResults, filters, typedChips, sortConfig]);

  const applyFilter = useCallback((valueOverride?: string) => {
    const valueToUse = valueOverride !== undefined ? valueOverride : filters.searchText;
    const trimmedValue = valueToUse.trim();
    if (trimmedValue === "") {
      return;
    }
    if (typedChips.includes(trimmedValue)) {
      return;
    }
    setTypedChips([...typedChips, trimmedValue]);
    setFilters(f => ({ ...f, searchText: '' }));
  }, [filters.searchText, typedChips]);

  const handleSearchKeywordPress = (event: any) => {
    const key = getEventKey(event);
    if (key === "Enter") {
        const currentValue = event.value;
        applyFilter(currentValue);
    }
  }

  const removeChip = useCallback((chip: string) => {
    setTypedChips(prev => prev.filter(c => c !== chip));
  }, []);

  const clearAllFilters = useCallback(() => {
    setTypedChips([]);
    setFilters({
      entity: 'all',
      status: 'all',
      searchText: '',
    });
    clearSort();
  }, [clearSort]);

  // Handle view change
  const handleViewChange = useCallback((action: string) => {
    if (action === 'table' || action === 'card' || action === 'list') {
      setSelectedView(action);
    }
  }, []);

  // Get view label and icon for menu button
  const getViewLabel = () => {
    switch (viewMode) {
      case 'table': return 'Table';
      case 'card': return 'Card';
      case 'list': return 'List';
    }
  };

  const getViewIcon = (): string => {
    switch (viewMode) {
      case 'table': return 'menu';
      case 'card': return 'grid';
      case 'list': return 'list';
    }
  };

  // Header actions with search input and filter dropdowns
  const headerActions = useMemo(() => (
    <div className="search-header-filters">
      <div className="search-header-filters__search">
        <GoabInput
          name="searchText"
          value={filters.searchText}
          onChange={(e: GoabInputOnChangeDetail) => setFilters(f => ({ ...f, searchText: e.value }))}
          onKeyPress={handleSearchKeywordPress}
          placeholder={isMobile ? "Search..." : "Search cases, staff, or file numbers..."}
          leadingIcon="search"
          size="compact"
          width="100%"
        />
      </div>

      <div className="search-header-filters__dropdowns">
        <GoabDropdown
          value={filters.entity}
          onChange={(e) => setFilters(f => ({ ...f, entity: e.value }))}
          placeholder="All types"
          size="compact"
          width="120px"
        >
          <GoabDropdownItem value="all" label="All types" />
          <GoabDropdownItem value="client" label="Clients" />
          <GoabDropdownItem value="case" label="Cases" />
          <GoabDropdownItem value="application" label="Applications" />
          <GoabDropdownItem value="document" label="Documents" />
        </GoabDropdown>

        <GoabDropdown
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.value }))}
          placeholder="All statuses"
          size="compact"
          width="150px"
          maxHeight="70vh"
        >
          <GoabDropdownItem value="all" label="All statuses" />
          {statusOptions.map(status => (
            <GoabDropdownItem key={status} value={status} label={status} />
          ))}
        </GoabDropdown>

        <GoabMenuButton
          size="compact"
          type="tertiary"
          leadingIcon={getViewIcon()}
          text={getViewLabel()}
          onAction={(e: GoabMenuButtonOnActionDetail) => handleViewChange(e.action)}
        >
          <GoabMenuAction
            text="Table"
            action="table"
            icon={selectedView === 'table' ? 'checkmark' : undefined}
          />
          <GoabMenuAction
            text="Card"
            action="card"
            icon={selectedView === 'card' ? 'checkmark' : undefined}
          />
          <GoabMenuAction
            text="List"
            action="list"
            icon={selectedView === 'list' ? 'checkmark' : undefined}
          />
        </GoabMenuButton>
      </div>
    </div>
  ), [filters, statusOptions, handleSearchKeywordPress, isMobile, viewMode, selectedView, handleViewChange, getViewLabel, getViewIcon]);

  usePageHeader("Search", headerActions);

  // Table column definitions
  const searchColumns: TableColumn<SearchResult>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      type: 'link',
      render: (result) => (
        <Link to={`/case/${result.id}`} className="table-row-link">
          {result.name}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      sortable: true,
      render: (result) => (
        <GoabBadge type={result.status} content={result.statusText} emphasis="subtle" icon={true} />
      ),
    },
    {
      key: 'staff',
      header: 'Staff',
      type: 'text',
      render: (result) => result.staff,
    },
    {
      key: 'dueDate',
      header: 'Due date',
      type: 'text',
      sortable: true,
      render: (result) => result.dueDate,
    },
    {
      key: 'fileNumber',
      header: 'File number',
      type: 'text',
      render: (result) => result.fileNumber,
    },
    {
      key: 'type',
      header: 'Type',
      type: 'badge',
      sortable: true,
      render: (result) => (
        <GoabBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" version="2" />
      ),
    },
    {
      key: 'actions',
      type: 'actions',
      render: (result) => (
        <GoabLink color="dark" mt="xs">
          <Link to={`/case/${result.id}`}>View</Link>
        </GoabLink>
      ),
    },
  ], []);

  const emptyStateContent = (
    <EmptyState onButtonClick={clearAllFilters} />
  );

  return (
    <div style={{maxWidth: "100%", overflow: "hidden", paddingBottom: "32px"}}>
      <div className="cases-content-padding">
        {/* Active filter chips */}
        {(typedChips.length > 0 || filters.entity !== 'all' || filters.status !== 'all') && (
          <div className="cases-chips-container">
            <GoabIcon type="filter-lines" size="small" fillColor="var(--goa-color-text-secondary)" mr="2xs"/>
            {filters.entity !== 'all' && (
              <GoabFilterChip
                content={filters.entity === 'client' ? 'Clients' : filters.entity === 'case' ? 'Cases' : filters.entity === 'application' ? 'Applications' : 'Documents'}
                onClick={() => setFilters(f => ({ ...f, entity: 'all' }))}
              />
            )}
            {filters.status !== 'all' && (
              <GoabFilterChip
                content={filters.status}
                onClick={() => setFilters(f => ({ ...f, status: 'all' }))}
              />
            )}
            {typedChips.map((chip) => (
              <GoabFilterChip
                key={chip}
                content={chip}
                onClick={() => removeChip(chip)}
              />
            ))}
            <GoabLink color="dark" size="small">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  clearAllFilters();
                }}
              >
                Clear all
              </a>
            </GoabLink>
          </div>
        )}
      </div>

      {/* Table view */}
      {viewMode === 'table' && (
        <DataTable
          columns={searchColumns}
          data={filteredResults}
          isLoading={isLoading}
          skeletonRows={10}
          onSort={handleTableSort}
          sortConfig={sortConfig}
          emptyState={searchResults.length > 0 && activeFiltersCount > 0 ? emptyStateContent : undefined}
          getRowKey={(result) => result.id}
        />
      )}

      {/* Card view */}
      {viewMode === 'card' && (
        <div className="cases-content-padding">
          <GoabDataGrid keyboardNav="layout" keyboardIconPosition="right">
            {isLoading ? (
              <div className="cases-card-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} data-grid="row">
                    <GoabContainer
                      accent="thick"
                      type="non-interactive"
                      padding="compact"
                      mb="none"
                      heading={
                        <div className="case-card__title">
                          <GoabSkeleton type="title" maxWidth="200px" />
                          <GoabSkeleton type="text" maxWidth="80px" />
                        </div>
                      }
                      actions={
                        <GoabSkeleton type="text" maxWidth="40px" />
                      }
                    >
                      <div className="case-card__body">
                        <div className="case-card__sections">
                          <div className="case-card__section">
                            <GoabSkeleton type="text-small" maxWidth="100px" />
                            <div className="case-card__section-fields">
                              <GoabSkeleton type="text" maxWidth="80px" />
                              <GoabSkeleton type="text" maxWidth="100px" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </GoabContainer>
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 && searchResults.length > 0 ? (
              emptyStateContent
            ) : (
              <div className="cases-card-grid">
                {filteredResults.map((result) => (
                  <div key={result.id} data-grid="row">
                    <GoabContainer
                      accent="thick"
                      type="non-interactive"
                      padding="compact"
                      mb="none"
                      heading={
                        <div className="case-card__title">
                          <GoabText size="heading-xs" mt="none" mb="none" data-grid="cell-1">{result.name}</GoabText>
                          <GoabBadge
                            data-grid="cell-2"
                            type={result.status}
                            content={result.statusText}
                            emphasis="subtle"
                            icon={true}
                          />
                        </div>
                      }
                      actions={
                        <div data-grid="cell-3">
                          <GoabButton
                            type="tertiary"
                            size="compact"
                            onClick={() => {
                              // TODO: Navigate to result detail
                            }}
                          >
                            View
                          </GoabButton>
                        </div>
                      }
                    >
                      <div className="case-card__body">
                        <div className="case-card__section-fields">
                              <GoabBlock direction="column" gap="xs" data-grid="cell-4">
                                <span className="case-card__label">Staff</span>
                                <span className="case-card__value">{result.staff || '—'}</span>
                              </GoabBlock>
                              <GoabBlock direction="column" gap="xs" data-grid="cell-5">
                                <span className="case-card__label">Due date</span>
                                <span className="case-card__value">{result.dueDate || '—'}</span>
                              </GoabBlock>
                              <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                                <span className="case-card__label">File number</span>
                                <span className="case-card__value">{result.fileNumber || '—'}</span>
                              </GoabBlock>
                              <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                                <span className="case-card__label">Type</span>
                                <span className="case-card__value">
                                  <GoabBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" icon={true} />
                                </span>
                              </GoabBlock>
                        </div>
                      </div>
                    </GoabContainer>
                  </div>
                ))}
              </div>
            )}
          </GoabDataGrid>
        </div>
      )}

      {/* List view - ExpandableListView has built-in GoabDataGrid with keyboard nav */}
      {viewMode === 'list' && (
        <div className="cases-content-padding">
          {filteredResults.length === 0 && searchResults.length > 0 ? (
            emptyStateContent
          ) : (
            <ExpandableListView
              data={filteredResults}
              isLoading={isLoading}
              getRowKey={(result) => result.id}
              renderCollapsed={(result) => ({
                title: <span className="expandable-list__name">{result.name}</span>,
                badge: <GoabBadge type={result.status} content={result.statusText} emphasis="subtle" icon={true} />,
                secondaryInfo: (
                  <GoabBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" version="2" />
                ),
                actions: (
                  <GoabButton
                    type="tertiary"
                    size="compact"
                    onClick={() => console.log('View result:', result.id)}
                  >
                    View
                  </GoabButton>
                ),
              })}
              renderExpanded={(result) => (
                <div className="case-card__sections">
                  <div className="case-card__section">
                    <div className="case-card__section-heading">Details</div>
                    <div className="case-card__section-fields">
                      <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                        <span className="case-card__label">Staff</span>
                        <span className="case-card__value">{result.staff || '—'}</span>
                      </GoabBlock>
                      <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                        <span className="case-card__label">Due date</span>
                        <span className="case-card__value">{result.dueDate || '—'}</span>
                      </GoabBlock>
                      <GoabBlock direction="column" gap="xs" data-grid="cell-8">
                        <span className="case-card__label">File number</span>
                        <span className="case-card__value">{result.fileNumber || '—'}</span>
                      </GoabBlock>
                      <GoabBlock direction="column" gap="xs" data-grid="cell-9">
                        <span className="case-card__label">Type</span>
                        <span className="case-card__value">
                          <GoabBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" icon={true} />
                        </span>
                      </GoabBlock>
                    </div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      )}

      {!isLoading && searchResults.length === 0 && (
        <GoabBlock mt="l" mb="l" alignment="center">
          <GoabText size="body-m" mt="none" mb="s">No search results available</GoabText>
          <GoabText size="body-s" mt="none" mb="none">All results have been deleted</GoabText>
        </GoabBlock>
      )}

      {!isLoading && searchResults.length > 0 && filteredResults.length === 0 && activeFiltersCount === 0 && (
        <GoabBlock mt="l" mb="l" alignment="center">
          <GoabText size="body-m" mt="none" mb="s">Start typing to search across all records</GoabText>
          <GoabText size="body-s" mt="none" mb="none">Search cases, applications, documents, and more</GoabText>
        </GoabBlock>
      )}
    </div>
  );
}
