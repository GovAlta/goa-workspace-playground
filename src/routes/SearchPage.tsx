import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GoabText,
  GoabFormItem,
  GoabBlock,
  GoabInput,
  GoabButton,
  GoabFilterChip,
  GoabTable,
  GoabTableSortHeader,
  GoabCheckbox,
  GoabBadge,
  GoabLink,
  GoabIconButton,
  GoabModal,
  GoabButtonGroup,
  GoabDataGrid,
  GoabCircularProgress,
} from "@abgov/react-components";
import { SearchResult, SortConfig } from "../types/SearchResult";
import mockData from "../data/mockSearchResults.json";
import { filterData, sortData, getEventValue, getEventKey } from "../utils/searchUtils";
import { getTypeBadgeProps } from "../utils/badgeUtils";
import {
  GoabCheckboxOnChangeDetail,
  GoabInputOnChangeDetail,
} from "@abgov/ui-components-common";
import { usePageHeader } from "../contexts/PageHeaderContext";
import { useMenu } from "../contexts/MenuContext";
import { ScrollContainer } from "../components/ScrollContainer";
import { mockFetch } from "../utils/mockApi";

export function SearchPage() {
  const { isMobile } = useMenu();
  usePageHeader("Search");
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchErrorMessage, setSearchErrorMessage] = useState('');
  const [typedChips, setTypedChips] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'none' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<string | null>(null);
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

  const handleSort = useCallback((event: CustomEvent | { detail: { sortBy: string; sortDir: number } }) => {
    const { sortBy, sortDir } = event.detail || event;
    setSortConfig({
      key: sortBy as keyof SearchResult,
      direction: sortDir === 1 ? 'asc' : sortDir === -1 ? 'desc' : 'none'
    });
  }, []);

  const handleSelectAll = (event: GoabCheckboxOnChangeDetail) => {
    const newValue = event.checked;
    setAllSelected(newValue);
    setSearchResults(prev => prev.map(r => ({ ...r, selected: newValue })));
  }

  const handleSelectResult = useCallback((id: string) => {
    setSearchResults(prev =>
      prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    );
  }, []);

  const deleteResult = useCallback((id: string) => {
    setResultToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (resultToDelete) {
      setSearchResults(prev => prev.filter(r => r.id !== resultToDelete));
    }
    setShowDeleteModal(false);
    setResultToDelete(null);
  }, [resultToDelete]);

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
  return (
    <div style={{paddingLeft: "32px"}}>
      <GoabFormItem id="searchInput" error={searchErrorMessage}>
        <GoabBlock gap="xs" direction="row" alignment="start">
          <div style={{ flex: 1 }}>
            <GoabInput
              name="searchInput"
              value={searchKeyword}
              maxLength={100}
              leadingIcon="search"
              width="100%"
              placeholder="Search clients, applications, documents..."
              onChange={(event: GoabInputOnChangeDetail) => {
                setSearchKeyword(event.value);
                if (searchErrorMessage) {
                  setSearchErrorMessage("");
                }
              }}
              onKeyPress={handleSearchKeywordPress}
            />
          </div>
          <GoabButton type="secondary" onClick={applyFilter} leadingIcon="search" size={isMobile ? "medium" : "large"}>
            Search
          </GoabButton>
        </GoabBlock>
      </GoabFormItem>

      {typedChips.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
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

      {typedChips.length > 0 && (
        <GoabText size="body-s" mt="none" mb="m">
          {filteredResults.length} results found
        </GoabText>
      )}
        <GoabCircularProgress variant="fullscreen" size="large" message="Loading search results..." visible={isLoading} />
        {!isLoading && (
          <>
            <ScrollContainer>
                <GoabDataGrid keyboardNav={"table"}>
                    <div style={{marginRight:"32px"}}>
                    <GoabTable width="100%" mb={"m"} mt="m" onSort={handleSort}>
                        <thead>
                        <tr data-grid="row">
                            <th style={{ paddingBottom: 0 }} data-grid="cell">
                                <GoabCheckbox name="selectAll" onChange={handleSelectAll} checked={allSelected} ariaLabel={"Select all results"}/>
                            </th>
                            <th data-grid="cell"><GoabTableSortHeader name="status">Status</GoabTableSortHeader></th>
                            <th data-grid="cell">Name</th>
                            <th data-grid="cell">Staff</th>
                            <th data-grid="cell"><GoabTableSortHeader name="dueDate">Due date</GoabTableSortHeader></th>
                            <th data-grid="cell">File number</th>
                            <th data-grid="cell"><GoabTableSortHeader name="type">Type</GoabTableSortHeader></th>
                            <th data-grid="cell"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredResults.map((result) => (
                            <tr key={result.id} data-grid="row">
                                <td data-grid="cell" className="goa-table-cell--checkbox">
                                    <GoabCheckbox
                                        name={`select-${result.id}`}
                                        checked={result.selected}
                                        onChange={() => handleSelectResult(result.id)}
                                    />
                                </td>
                                <td data-grid="cell" className="goa-table-cell--badge"><GoabBadge type={result.status} content={result.statusText} /></td>
                                <td data-grid="cell" className="goa-table-cell--text">
                                    <GoabLink>
                                        <Link to={`/client/${result.id}`}>
                                            {result.name}
                                        </Link>
                                    </GoabLink>
                                </td>
                                <td data-grid="cell" className="goa-table-cell--text">{result.staff}</td>
                                <td data-grid="cell" className="goa-table-cell--text">{result.dueDate}</td>
                                <td data-grid="cell" className="goa-table-cell--text">{result.fileNumber}</td>
                                <td data-grid="cell" className="goa-table-cell--badge">
                                    <GoabBadge {...getTypeBadgeProps(result.type)} />
                                </td>
                                <td data-grid="cell" className="goa-table-cell--icon-button">
                                    <GoabIconButton
                                        icon="trash"
                                        size="small"
                                        onClick={() => deleteResult(result.id)}
                                        aria-label={`Delete ${result.name}`}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </GoabTable>
                    </div>
                </GoabDataGrid>
            </ScrollContainer>

            {filteredResults.length === 0 && searchResults.length > 0 && typedChips.length > 0 && (
              <GoabBlock mt="l" mb="l">
                <GoabText>No results found for your search criteria</GoabText>
              </GoabBlock>
            )}

            {searchResults.length === 0 && (
              <GoabBlock mt="l" mb="l" alignment="center">
                <GoabText size="body-m" mt="none" mb="s">No search results available</GoabText>
                <GoabText size="body-s" mt="none" mb="none">All results have been deleted</GoabText>
              </GoabBlock>
            )}

            {searchResults.length > 0 && filteredResults.length === 0 && typedChips.length === 0 && (
              <GoabBlock mt="l" mb="l" alignment="center">
                <GoabText size="body-m" mt="none" mb="s">Start typing to search across all records</GoabText>
                <GoabText size="body-s" mt="none" mb="none">Search clients, applications, documents, and more</GoabText>
              </GoabBlock>
            )}
          </>
        )}

      <GoabModal
        heading="Delete search result"
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        actions={
          <GoabButtonGroup alignment="end">
            <GoabButton type="tertiary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </GoabButton>
            <GoabButton type="primary" variant="destructive" onClick={confirmDelete}>
              Delete
            </GoabButton>
          </GoabButtonGroup>
        }
      >
        <GoabText tag="p" mt="none" mb="none">
          Are you sure you want to delete this search result? This action cannot be undone.
        </GoabText>
      </GoabModal>
    </div>
  );
}
