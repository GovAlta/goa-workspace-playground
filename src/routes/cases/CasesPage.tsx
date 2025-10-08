import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CasesPage.css";
import {
  GoabButtonGroup,
  GoabButton,
  GoabCheckbox,
  GoabBadge,
  GoabMenuButton,
  GoabMenuAction,
  GoabContainer,
  GoabBlock,
  GoabSkeleton,
  GoabDataGrid,
} from "@abgov/react-components";
import {
  GoabInputOnKeyPressDetail,
  GoabMenuButtonOnActionDetail,
} from "@abgov/ui-components-common";
import { filterData, sortData } from "../../utils/searchUtils";
import { getPriorityBadgeProps } from "../../utils/badgeUtils";
import { PageHeader } from "../../components/PageHeader";
import { usePageFooter } from "../../contexts/PageFooterContext";
import { useMenu } from "../../contexts/MenuContext";
import { useMultiColumnSort } from "../../hooks/useMultiColumnSort";
import { useCompactToolbar } from "../../hooks/useViewport";
import { useDisplaySettings } from "../../hooks/useDisplaySettings";
import { Case } from "../../types/Case";
import { TableColumn } from "../../types/TableColumn";
import mockData from "../../data/mockCases.json";
import { mockFetch } from "../../utils/mockApi";
import { EmptyState } from "../../components/EmptyState";
import { LayoutType } from "../../components/DisplaySettings";

import { FilterState, FilterChip, FilterOptions, GroupedCase } from "./types";
import { CaseDeleteModal } from "./CaseDeleteModal";
import { CaseFilterDrawer } from "./CaseFilterDrawer";
import { CaseFilterChips } from "./CaseFilterChips";
import { CaseCard } from "./CaseCard";
import { CaseTable } from "./CaseTable";
import { CaseListView } from "./CaseListView";
import { CaseToolbar } from "./CaseToolbar";

export function CasesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [typedChips, setTypedChips] = useState<string[]>([]);
  const { sortConfig, setSortConfig, sortByKey, handleTableSort, clearSort } =
    useMultiColumnSort();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const { isMobile } = useMenu();
  const isCompactToolbar = useCompactToolbar();

  const getDefaultLayout = useCallback((tab: string): LayoutType => {
    if (tab === "complete") return "list";
    if (tab === "todo" || tab === "progress") return "card";
    return "table";
  }, []);

  const { viewSettings, setViewSettings, layoutCustomized, handleSettingsChange } =
    useDisplaySettings({
      pageKey: "cases",
      getDefaultLayout,
      initialTab: "all",
    });

  const defaultLayout = useMemo(
    () => getDefaultLayout(activeTab),
    [activeTab, getDefaultLayout],
  );

  useEffect(() => {
    if (!layoutCustomized) {
      setViewSettings({
        ...viewSettings,
        layout: defaultLayout,
      });
    }
  }, [activeTab, defaultLayout, layoutCustomized]);

  const viewMode = useMemo((): "table" | "card" | "list" => {
    if (isMobile && viewSettings.layout === "table") return "card";
    return viewSettings.layout;
  }, [isMobile, viewSettings.layout]);

  // Simulate fetching cases from an API
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      const data = await mockFetch<Case[]>(mockData as Case[]);
      setCases(data);
      setIsLoading(false);
    };
    fetchCases();
  }, []);

  const [pendingFilters, setPendingFilters] = useState<FilterState>({
    status: [],
    priority: [],
    jurisdiction: [],
    staff: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    status: [],
    priority: [],
    jurisdiction: [],
    staff: [],
  });

  const filterOptions: FilterOptions = useMemo(() => {
    const statuses = [...new Set(cases.map((c) => c.statusText))].sort();
    const priorities = ["high", "medium", "low"];
    const jurisdictions = [...new Set(cases.map((c) => c.jurisdiction))].sort();
    const staffMembers = [...new Set(cases.map((c) => c.staff))].sort();
    return { statuses, priorities, jurisdictions, staffMembers };
  }, [cases]);

  const togglePendingFilter = (category: keyof FilterState, value: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
    setFilterDrawerOpen(false);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      status: [],
      priority: [],
      jurisdiction: [],
      staff: [],
    };
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const removeAppliedFilter = (category: string, value: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [category]: prev[category as keyof FilterState].filter((v) => v !== value),
    }));
  };

  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    appliedFilters.status.forEach((v) =>
      chips.push({ category: "status", value: v, label: v }),
    );
    appliedFilters.priority.forEach((v) =>
      chips.push({
        category: "priority",
        value: v,
        label: v.charAt(0).toUpperCase() + v.slice(1) + " priority",
      }),
    );
    appliedFilters.staff.forEach((v) =>
      chips.push({ category: "staff", value: v, label: v }),
    );
    appliedFilters.jurisdiction.forEach((v) =>
      chips.push({ category: "jurisdiction", value: v, label: v }),
    );
    return chips;
  }, [appliedFilters]);

  const filteredCases = useMemo(() => {
    let filtered = cases;
    if (activeTab !== "all") {
      filtered = cases.filter((caseItem) => caseItem.category === activeTab);
    }
    filtered = filterData(typedChips, filtered);

    if (appliedFilters.status.length > 0) {
      filtered = filtered.filter((c) => appliedFilters.status.includes(c.statusText));
    }
    if (appliedFilters.priority.length > 0) {
      filtered = filtered.filter((c) => appliedFilters.priority.includes(c.priority));
    }
    if (appliedFilters.jurisdiction.length > 0) {
      filtered = filtered.filter((c) =>
        appliedFilters.jurisdiction.includes(c.jurisdiction),
      );
    }
    if (appliedFilters.staff.length > 0) {
      filtered = filtered.filter((c) => appliedFilters.staff.includes(c.staff));
    }

    return sortData(
      filtered,
      sortConfig.primary?.key || null,
      sortConfig.primary?.direction || "none",
      sortConfig.secondary?.key || null,
      sortConfig.secondary?.direction,
    );
  }, [cases, activeTab, typedChips, sortConfig, appliedFilters]);

  const groupedCases: GroupedCase[] | null = useMemo(() => {
    if (!viewSettings.groupBy) return null;

    const groups: GroupedCase[] = [];
    const groupMap = new Map<string, Case[]>();

    filteredCases.forEach((caseItem) => {
      let groupKey: string;
      switch (viewSettings.groupBy) {
        case "status":
          groupKey = caseItem.statusText || "Unknown";
          break;
        case "priority":
          groupKey = caseItem.priority || "None";
          break;
        case "staff":
          groupKey = caseItem.staff || "Unassigned";
          break;
        case "jurisdiction":
          groupKey = caseItem.jurisdiction || "Unknown";
          break;
        default:
          groupKey = "Unknown";
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(caseItem);
    });

    groupMap.forEach((cases, key) => {
      groups.push({ key, label: key, cases });
    });

    return groups;
  }, [filteredCases, viewSettings.groupBy]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (groupedCases) {
      setExpandedGroups(new Set(groupedCases.map((g) => g.key)));
    }
  }, [viewSettings.groupBy]);

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }, []);

  const myCasesCount = useMemo(
    () => cases.filter((c) => c.category === "todo").length,
    [cases],
  );
  const inProgressCount = useMemo(
    () => cases.filter((c) => c.category === "progress").length,
    [cases],
  );

  const selectedCount = useMemo(
    () => filteredCases.filter((c) => c.selected).length,
    [filteredCases],
  );
  const isAllSelected = selectedCount > 0 && selectedCount === filteredCases.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < filteredCases.length;

  const applyFilter = (valueOverride?: string) => {
    const valueToUse = valueOverride !== undefined ? valueOverride : inputValue;
    const trimmedValue = valueToUse.trim();
    if (trimmedValue === "") {
      setInputError("Search field empty");
      return;
    }
    if (typedChips.includes(trimmedValue)) {
      setInputValue("");
      setInputError("You already entered this search term");
      return;
    }
    setTypedChips([...typedChips, trimmedValue]);
    setInputValue("");
    setInputError("");
  };

  const handleTabChange = (event: any) => {
    const tabIndex = event.detail?.tab || event.tab;
    const tabMap = ["all", "todo", "progress", "complete"];
    setActiveTab(tabMap[tabIndex - 1] || "all");
    setCases((prev) => prev.map((c) => ({ ...c, selected: false })));
  };

  const handleSortAction = (action: string) => {
    if (action === "clear-sort") {
      clearSort();
      return;
    }
    const key = action.replace("sort-", "");
    sortByKey(key);
  };

  const deleteCase = (id: string) => {
    setCaseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (caseToDelete) {
      setCases(cases.filter((c) => c.id !== caseToDelete));
    }
    setShowDeleteModal(false);
    setCaseToDelete(null);
  };

  const removeChip = useCallback((chip: string) => {
    setTypedChips((prev) => prev.filter((c) => c !== chip));
  }, []);

  const clearAllChips = useCallback(() => {
    setTypedChips([]);
  }, []);

  const onMenuActionButton = (action: string, caseId: string) => {
    switch (action) {
      case "edit":
        break;
      case "view":
        break;
      case "delete":
        deleteCase(caseId);
        break;
    }
  };

  const handleInputKeyPress = (event: GoabInputOnKeyPressDetail) => {
    if (event.key === "Enter") {
      const value = event.value;
      setTimeout(() => {
        applyFilter(value);
      }, 0);
    }
  };

  const handleRemoveSort = (level: "primary" | "secondary") => {
    if (level === "primary") {
      setSortConfig({ primary: sortConfig.secondary, secondary: null });
    } else {
      setSortConfig((prev) => ({ ...prev, secondary: null }));
    }
  };

  const handleClearAll = () => {
    clearAllChips();
    clearAllFilters();
    clearSort();
  };

  const handleSelectChange = (caseId: string, selected: boolean) => {
    setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, selected } : c)));
  };

  usePageFooter({
    content: (
      <GoabButtonGroup gap="compact" alignment="start">
        <GoabButton
          type="tertiary"
          size="compact"
          onClick={() => setCases((prev) => prev.map((c) => ({ ...c, selected: false })))}
        >
          Clear selection ({selectedCount})
        </GoabButton>
        <GoabButton type="primary" size="compact" onClick={() => {}}>
          Assign to me
        </GoabButton>
        <GoabButton
          type="primary"
          size="compact"
          variant="destructive"
          onClick={() => setCases((prev) => prev.filter((c) => !c.selected))}
        >
          Delete selected
        </GoabButton>
      </GoabButtonGroup>
    ),
    visibleWhen: "selection",
    hasSelection: selectedCount > 0,
  });

  const caseColumns: TableColumn<Case>[] = useMemo(
    () => [
      {
        key: "select",
        type: "checkbox",
        headerRender: () => (
          <GoabCheckbox
            name="selectAll"
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={() => {
              const newValue = !isAllSelected && !isIndeterminate;
              setCases((prev) => prev.map((c) => ({ ...c, selected: newValue })));
            }}
            ariaLabel="Select all cases"
          />
        ),
        render: (caseItem) => (
          <GoabCheckbox
            name={`select-${caseItem.id}`}
            checked={caseItem.selected}
            onChange={() => handleSelectChange(caseItem.id, !caseItem.selected)}
            ariaLabel={`Select ${caseItem.name}`}
          />
        ),
      },
      {
        key: "name",
        header: "Name",
        type: "link",
        render: (caseItem) => (
          <Link to={`/case/${caseItem.id}`} className="table-row-link">
            {caseItem.name}
          </Link>
        ),
      },
      {
        key: "status",
        header: "Status",
        type: "badge",
        sortable: true,
        render: (caseItem) => (
          <GoabBadge type={caseItem.status} content={caseItem.statusText} icon={true} />
        ),
      },
      {
        key: "staff",
        header: "Assigned to",
        type: "text",
        render: (caseItem) => caseItem.staff || "—",
      },
      {
        key: "dueDate",
        header: "Due date",
        type: "text",
        sortable: true,
        render: (caseItem) => caseItem.dueDate || "—",
      },
      {
        key: "jurisdiction",
        header: "Jurisdiction",
        type: "text",
        sortable: true,
        render: (caseItem) => caseItem.jurisdiction || "—",
      },
      {
        key: "fileNumber",
        header: "File number",
        type: "text",
        render: (caseItem) => caseItem.fileNumber || "—",
      },
      {
        key: "priority",
        header: "Priority",
        type: "badge",
        sortable: true,
        render: (caseItem) =>
          caseItem.priority ? (
            <GoabBadge {...getPriorityBadgeProps(caseItem.priority)} />
          ) : (
            "—"
          ),
      },
      {
        key: "actions",
        type: "actions",
        render: (caseItem) => (
          <GoabMenuButton
            leadingIcon="ellipsis-horizontal"
            size="compact"
            onAction={(e: GoabMenuButtonOnActionDetail) =>
              onMenuActionButton(e.action, caseItem.id)
            }
          >
            <GoabMenuAction text="View case" action="view" />
            <GoabMenuAction text="Assign to me" action="assign" />
            <GoabMenuAction text="Delete" icon="trash" action="delete" />
          </GoabMenuButton>
        ),
      },
    ],
    [isAllSelected, isIndeterminate, onMenuActionButton],
  );

  const visibleCaseColumns = useMemo(() => {
    return caseColumns.filter(
      (col) =>
        col.key === "select" ||
        col.key === "actions" ||
        viewSettings.visibleColumns.includes(col.key),
    );
  }, [caseColumns, viewSettings.visibleColumns]);

  const headerActions = useMemo(
    () => (
      <GoabButtonGroup gap="compact" alignment={"start"}>
        <GoabButton type="secondary" size="compact">
          More
        </GoabButton>
        <GoabButton type="primary" size="compact">
          Add application
        </GoabButton>
      </GoabButtonGroup>
    ),
    [],
  );

  const headerToolbar = useMemo(
    () => (
      <CaseToolbar
        activeTab={activeTab}
        myCasesCount={myCasesCount}
        inProgressCount={inProgressCount}
        onTabChange={handleTabChange}
        inputValue={inputValue}
        inputError={inputError}
        onInputChange={(value) => {
          setInputValue(value);
          if (inputError) setInputError("");
        }}
        onInputKeyPress={handleInputKeyPress}
        sortConfig={sortConfig}
        onSortAction={handleSortAction}
        viewSettings={viewSettings}
        onSettingsChange={(newSettings) =>
          handleSettingsChange(newSettings, defaultLayout)
        }
        defaultLayout={defaultLayout}
        isMobile={isMobile}
        isCompactToolbar={isCompactToolbar}
        onFilterOpen={() => {
          setPendingFilters(appliedFilters);
          setFilterDrawerOpen(true);
        }}
      />
    ),
    [
      activeTab,
      myCasesCount,
      inProgressCount,
      inputValue,
      inputError,
      sortConfig,
      appliedFilters,
      viewSettings,
      defaultLayout,
      isMobile,
      isCompactToolbar,
    ],
  );

  const emptyStateContent = <EmptyState onButtonClick={clearAllChips} />;

  return (
    <>
      <PageHeader title="Cases" actions={headerActions} toolbar={headerToolbar} />
      <div style={{ maxWidth: "100%", overflow: "hidden", paddingBottom: "16px" }}>
        <div className="content-padding">
          <CaseFilterChips
            searchChips={typedChips}
            filterChips={filterChips}
            sortConfig={sortConfig}
            onRemoveSearchChip={removeChip}
            onRemoveFilter={removeAppliedFilter}
            onRemoveSort={handleRemoveSort}
            onClearAll={handleClearAll}
          />
        </div>

        {viewMode === "table" && (
          <CaseTable
            filteredCases={filteredCases}
            groupedCases={groupedCases}
            columns={visibleCaseColumns}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            isLoading={isLoading}
            emptyState={cases.length > 0 ? emptyStateContent : undefined}
            sortConfig={sortConfig}
            onSort={handleTableSort}
            onRowClick={(caseItem) => handleSelectChange(caseItem.id, !caseItem.selected)}
            getRowKey={(caseItem) => caseItem.id}
            getRowSelected={(caseItem) => caseItem.selected}
          />
        )}

        {viewMode === "list" && (
          <CaseListView
            filteredCases={filteredCases}
            groupedCases={groupedCases}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            isLoading={isLoading}
            emptyState={cases.length > 0 ? emptyStateContent : undefined}
            onMenuAction={onMenuActionButton}
          />
        )}

        {viewMode === "card" && (
          <div className="content-padding">
            <GoabDataGrid keyboardNav="layout" keyboardIconPosition="right">
              {isLoading ? (
                <div className="card-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} data-grid="row">
                      <GoabContainer
                        accent="thick"
                        type="non-interactive"
                        padding="compact"
                        mb="none"
                        heading={
                          <div className="data-card__title">
                            <GoabSkeleton type="title" maxWidth="200px" />
                            <GoabSkeleton type="text" maxWidth="80px" />
                          </div>
                        }
                        actions={<GoabSkeleton type="text" maxWidth="40px" />}
                      >
                        <div className="data-card__body">
                          <div className="data-card__row">
                            <GoabBlock direction="column" gap="2xs">
                              <GoabSkeleton type="text-small" maxWidth="60px" />
                              <GoabSkeleton type="text" maxWidth="100px" />
                            </GoabBlock>
                            <GoabBlock direction="column" gap="2xs">
                              <GoabSkeleton type="text-small" maxWidth="50px" />
                              <GoabSkeleton type="text" maxWidth="80px" />
                            </GoabBlock>
                          </div>
                        </div>
                      </GoabContainer>
                    </div>
                  ))}
                </div>
              ) : filteredCases.length === 0 && cases.length > 0 ? (
                <EmptyState onButtonClick={clearAllChips} />
              ) : groupedCases ? (
                <div className="cases-grouped-view">
                  {groupedCases.map((group) => (
                    <div key={group.key} className="cases-group">
                      <button
                        className="cases-group__header"
                        onClick={() => toggleGroup(group.key)}
                        aria-expanded={expandedGroups.has(group.key)}
                      >
                        <span className="cases-group__label">{group.label}</span>
                        <GoabBadge
                          type="information"
                          content={String(group.cases.length)}
                        />
                      </button>
                      {expandedGroups.has(group.key) && (
                        <div className="card-grid">
                          {group.cases.map((caseItem) => (
                            <CaseCard
                              key={caseItem.id}
                              caseItem={caseItem}
                              activeTab={activeTab}
                              onMenuAction={onMenuActionButton}
                              onSelectChange={handleSelectChange}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-grid">
                  {filteredCases.map((caseItem) => (
                    <CaseCard
                      key={caseItem.id}
                      caseItem={caseItem}
                      activeTab={activeTab}
                      onMenuAction={onMenuActionButton}
                      onSelectChange={handleSelectChange}
                    />
                  ))}
                </div>
              )}
            </GoabDataGrid>
          </div>
        )}

        <CaseDeleteModal
          open={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />

        <CaseFilterDrawer
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          pendingFilters={pendingFilters}
          filterOptions={filterOptions}
          onToggleFilter={togglePendingFilter}
          onApply={applyFilters}
          onClearAll={() =>
            setPendingFilters({ status: [], priority: [], jurisdiction: [], staff: [] })
          }
        />
      </div>
    </>
  );
}
