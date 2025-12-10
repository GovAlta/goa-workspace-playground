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
} from "@abgov/react-components";
import { SearchResult } from "../types/SearchResult";
import { TableColumn } from "../types/TableColumn";
import mockData from "../data/mockSearchResults.json";
import { filterData, sortData, getEventKey } from "../utils/searchUtils";
import { getTypeBadgeProps } from "../utils/badgeUtils";
import { GoabInputOnChangeDetail, GoabTableOnSortDetail } from "@abgov/ui-components-common";
import { usePageHeader } from "../contexts/PageHeaderContext";
import { useMenu } from "../contexts/MenuContext";
import { mockFetch } from "../utils/mockApi";
import emptyStateIllustration from "../assets/empty-state-illustration.svg";
import { DataTable } from "../components/DataTable";

export function SearchPage() {
  const { isMobile } = useMenu();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchErrorMessage, setSearchErrorMessage] = useState('');
  const [typedChips, setTypedChips] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | 'none' }>({ key: '', direction: 'none' });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const filteredResults = useMemo(() => {
    const filtered = filterData(typedChips, searchResults);
    return sortData(filtered, sortConfig.key, sortConfig.direction);
  }, [typedChips, searchResults, sortConfig]);

  const applyFilter = useCallback((valueOverride?: string) => {
    const valueToUse = valueOverride !== undefined ? valueOverride : searchKeyword;
    const trimmedValue = valueToUse.trim();
    if (trimmedValue === "") {
      setSearchErrorMessage('Empty filter');
      return;
    }
    if (typedChips.includes(trimmedValue)) {
      setSearchErrorMessage('Enter a unique filter');
      return;
    }
    setTypedChips([...typedChips, trimmedValue]);
    setSearchKeyword("");
    setSearchErrorMessage("");
  }, [searchKeyword, typedChips]);

  const handleSort = useCallback((event: GoabTableOnSortDetail) => {
    const { sortBy, sortDir } = event;
    setSortConfig({
      key: sortBy,
      direction: sortDir === 1 ? 'asc' : sortDir === -1 ? 'desc' : 'none'
    });
  }, []);

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

  const clearAllChips = useCallback(() => {
    setTypedChips([]);
  }, []);

  // Header actions with search input - memoized to prevent infinite re-renders
  const headerActions = useMemo(() => (
    <div className="page-header-search" style={{ display: 'flex', gap: 'var(--goa-space-xs)', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <div style={{ flex: 1, minWidth: '120px' }}>
        <GoabInput
          name="searchInput"
          value={searchKeyword}
          maxLength={100}
          leadingIcon="search"
          width="100%"
          size="compact"
          placeholder={isMobile ? "Search..." : "Search clients, staff, or file numbers..."}
          onChange={(event: GoabInputOnChangeDetail) => {
            setSearchKeyword(event.value);
            if (searchErrorMessage) {
              setSearchErrorMessage("");
            }
          }}
          onKeyPress={handleSearchKeywordPress}
        />
      </div>
      <div>
        <GoabButton type="secondary" onClick={() => applyFilter()} size="compact">
          Search
        </GoabButton>
      </div>
    </div>
  ), [searchKeyword, isMobile, searchErrorMessage, handleSearchKeywordPress, applyFilter]);

  usePageHeader("Search", headerActions);

  // Table column definitions
  const searchColumns: TableColumn<SearchResult>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      type: 'link',
      render: (result) => (
        <Link to={`/client/${result.id}`} className="table-row-link">
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
        <GoabBadge {...getTypeBadgeProps(result.type)} emphasis="subtle" icon={true} />
      ),
    },
  ], []);

  const emptyStateContent = (
    <div className="clients-empty-state">
      <img src={emptyStateIllustration} alt="" className="clients-empty-state__illustration" />
      <span className="clients-empty-state__heading">No results found</span>
      <span className="clients-empty-state__subline">Try adjusting your search or filters.</span>
      <GoabButton type="tertiary" size="compact" onClick={clearAllChips}>
        Clear filters
      </GoabButton>
    </div>
  );

  return (
    <div style={{maxWidth: "100%", overflow: "hidden", paddingBottom: "32px"}}>
      <div className="clients-content-padding">
        {typedChips.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <GoabIcon type="filter" size="small" fillColor="var(--goa-color-text-secondary)" mr="2xs"/>
            {typedChips.map((chip) => (
              <GoabFilterChip
                key={chip}
                content={chip}
                onClick={() => removeChip(chip)}
              />
            ))}
            <GoabButton type="tertiary" size="compact" onClick={clearAllChips}>
              Clear all
            </GoabButton>
          </div>
        )}
      </div>
      <DataTable
        columns={searchColumns}
        data={filteredResults}
        isLoading={isLoading}
        skeletonRows={10}
        onSort={handleSort}
        sortConfig={sortConfig}
        emptyState={searchResults.length > 0 && typedChips.length > 0 ? emptyStateContent : undefined}
        getRowKey={(result) => result.id}
      />

      {!isLoading && searchResults.length === 0 && (
        <GoabBlock mt="l" mb="l" alignment="center">
          <GoabText size="body-m" mt="none" mb="s">No search results available</GoabText>
          <GoabText size="body-s" mt="none" mb="none">All results have been deleted</GoabText>
        </GoabBlock>
      )}

      {!isLoading && searchResults.length > 0 && filteredResults.length === 0 && typedChips.length === 0 && (
        <GoabBlock mt="l" mb="l" alignment="center">
          <GoabText size="body-m" mt="none" mb="s">Start typing to search across all records</GoabText>
          <GoabText size="body-s" mt="none" mb="none">Search clients, applications, documents, and more</GoabText>
        </GoabBlock>
      )}
    </div>
  );
}
