import React, {useState, useMemo, useCallback, useEffect} from "react";
import {Link} from "react-router-dom";
import {
    GoabText,
    GoabButton,
    GoabTabs,
    GoabTab,
    GoabFormItem,
    GoabInput,
    GoabFilterChip,
    GoabCheckbox,
    GoabBadge,
    GoabIcon,
    GoabModal,
    GoabButtonGroup,
    GoabDrawer,
    GoabSkeleton,
    GoabDivider, GoabMenuButton, GoabMenuAction, GoabContainer, GoabBlock, GoabDataGrid, GoabLink,
} from "@abgov/react-components";
import {filterData, sortData} from "../utils/searchUtils";
import {getPriorityBadgeProps} from "../utils/badgeUtils";
import {usePageHeader} from "../contexts/PageHeaderContext";
import {useMenu} from "../contexts/MenuContext";
import {useTwoLevelSort} from "../hooks/useTwoLevelSort";
import {
    GoabInputOnChangeDetail,
    GoabInputOnKeyPressDetail,
    GoabMenuButtonOnActionDetail
} from "@abgov/ui-components-common";
import {Case} from "../types/Case";
import {TableColumn} from "../types/TableColumn";
import mockData from "../data/mockCases.json";
import {mockFetch} from "../utils/mockApi";
import {DataTable} from "../components/DataTable";
import {ExpandableListView} from "../components/ExpandableListView";
import {EmptyState} from "../components/EmptyState";

export function CasesPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const [typedChips, setTypedChips] = useState<string[]>([]);
    const { sortConfig, setSortConfig, sortByKey, handleTableSort, clearSort } = useTwoLevelSort();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
    const [cases, setCases] = useState<Case[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Get mobile state from MenuContext
    const { isMobile } = useMenu();

    // Compute view mode based on active tab and mobile state
    // - "complete" tab: always list view (responsive, works on mobile)
    // - "todo" and "progress" tabs: always card view
    // - "all" tab: table on desktop, card on mobile
    const viewMode = useMemo((): 'table' | 'card' | 'list' => {
        if (activeTab === 'complete') return 'list';
        if (activeTab === 'todo' || activeTab === 'progress') return 'card';
        if (isMobile) return 'card';
        return 'table';
    }, [activeTab, isMobile]);

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

    // Filter drawer state
    const [pendingFilters, setPendingFilters] = useState({
        status: [] as string[],
        priority: [] as string[],
        jurisdiction: [] as string[],
        staff: [] as string[],
    });
    const [appliedFilters, setAppliedFilters] = useState({
        status: [] as string[],
        priority: [] as string[],
        jurisdiction: [] as string[],
        staff: [] as string[],
    });

    // Extract unique values from data for filter options
    const filterOptions = useMemo(() => {
        const statuses = [...new Set(cases.map(c => c.statusText))].sort();
        const priorities = ['high', 'medium', 'low'];
        const jurisdictions = [...new Set(cases.map(c => c.jurisdiction))].sort();
        const staffMembers = [...new Set(cases.map(c => c.staff))].sort();
        return {statuses, priorities, jurisdictions, staffMembers};
    }, [cases]);

    const togglePendingFilter = (category: keyof typeof pendingFilters, value: string) => {
        setPendingFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(v => v !== value)
                : [...prev[category], value]
        }));
    };

    const applyFilters = () => {
        setAppliedFilters(pendingFilters);
        setFilterDrawerOpen(false);
    };

    const clearAllFilters = () => {
        const emptyFilters = {status: [], priority: [], jurisdiction: [], staff: []};
        setPendingFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
    };

    const removeAppliedFilter = (category: keyof typeof appliedFilters, value: string) => {
        setAppliedFilters(prev => ({
            ...prev,
            [category]: prev[category].filter(v => v !== value)
        }));
    };

    // Build a flat list of all filter chips for display
    const filterChips = useMemo(() => {
        const chips: { category: keyof typeof appliedFilters; value: string; label: string }[] = [];
        appliedFilters.status.forEach(v => chips.push({category: 'status', value: v, label: v}));
        appliedFilters.priority.forEach(v => chips.push({
            category: 'priority',
            value: v,
            label: v.charAt(0).toUpperCase() + v.slice(1) + ' priority'
        }));
        appliedFilters.staff.forEach(v => chips.push({category: 'staff', value: v, label: v}));
        appliedFilters.jurisdiction.forEach(v => chips.push({category: 'jurisdiction', value: v, label: v}));
        return chips;
    }, [appliedFilters]);

    const filteredCases = useMemo(() => {
        let filtered = cases;
        if (activeTab !== 'all') {
            filtered = cases.filter(caseItem => caseItem.category === activeTab);
        }
        filtered = filterData(typedChips, filtered);

        // Apply drawer filters
        if (appliedFilters.status.length > 0) {
            filtered = filtered.filter(c => appliedFilters.status.includes(c.statusText));
        }
        if (appliedFilters.priority.length > 0) {
            filtered = filtered.filter(c => appliedFilters.priority.includes(c.priority));
        }
        if (appliedFilters.jurisdiction.length > 0) {
            filtered = filtered.filter(c => appliedFilters.jurisdiction.includes(c.jurisdiction));
        }
        if (appliedFilters.staff.length > 0) {
            filtered = filtered.filter(c => appliedFilters.staff.includes(c.staff));
        }

        return sortData(
            filtered,
            sortConfig.primary?.key || null,
            sortConfig.primary?.direction || 'none',
            sortConfig.secondary?.key || null,
            sortConfig.secondary?.direction
        );
    }, [cases, activeTab, typedChips, sortConfig, appliedFilters]);

    // Calculate counts for each tab category
    const myCasesCount = useMemo(() => cases.filter(c => c.category === 'todo').length, [cases]);
    const inProgressCount = useMemo(() => cases.filter(c => c.category === 'progress').length, [cases]);

    // Calculate selection state for header checkbox
    const selectedCount = useMemo(() =>
        filteredCases.filter(c => c.selected).length,
        [filteredCases]
    );
    const isAllSelected = selectedCount > 0 && selectedCount === filteredCases.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < filteredCases.length;

    const applyFilter = (valueOverride?: string) => {
        const valueToUse = valueOverride !== undefined ? valueOverride : inputValue;
        const trimmedValue = valueToUse.trim();
        if (trimmedValue === "") {
            setInputError('Search field empty');
            return;
        }
        if (typedChips.includes(trimmedValue)) {
            setInputValue("");
            setInputError('You already entered this search term');
            return;
        }
        setTypedChips([...typedChips, trimmedValue]);
        setInputValue("");
        setInputError("");
    };

    const handleTabChange = (event: any) => {
        const tabIndex = event.detail?.tab || event.tab;
        const tabMap = ['all', 'todo', 'progress', 'complete'];
        setActiveTab(tabMap[tabIndex - 1] || 'all');
    };

    // Sort field labels for display
    const sortFieldLabels: Record<string, string> = {
        status: 'Status',
        dueDate: 'Due date',
        jurisdiction: 'Jurisdiction',
        priority: 'Priority'
    };

    // Handle sort from MenuButton actions
    const handleSortAction = (action: string) => {
        if (action === 'clear-sort') {
            clearSort();
            return;
        }
        const key = action.replace('sort-', '');
        sortByKey(key);
    };

    // Get sort button label
    const getSortButtonLabel = (): string => {
        if (!sortConfig.primary) return 'Sort';
        const primaryLabel = sortFieldLabels[sortConfig.primary.key] || sortConfig.primary.key;
        if (sortConfig.secondary) {
            const secondaryLabel = sortFieldLabels[sortConfig.secondary.key] || sortConfig.secondary.key;
            return `${primaryLabel}, ${secondaryLabel}`;
        }
        return primaryLabel;
    };

    // Get indicator for menu item
    const getSortIndicator = (key: string): string => {
        if (sortConfig.primary?.key === key) {
            const arrow = sortConfig.primary.direction === 'asc' ? '↑' : '↓';
            // Only show "1st" if there's also a secondary sort
            return sortConfig.secondary ? ` (1st ${arrow})` : ` ${arrow}`;
        }
        if (sortConfig.secondary?.key === key) {
            const arrow = sortConfig.secondary.direction === 'asc' ? '↑' : '↓';
            return ` (2nd ${arrow})`;
        }
        return '';
    };

    // Get icon for sort menu item (checkmark when selected as primary with no secondary)
    const getSortIcon = (key: string): "checkmark" | undefined => {
        if (sortConfig.primary?.key === key && !sortConfig.secondary) {
            return "checkmark";
        }
        return undefined;
    };

    const deleteCase = (id: string) => {
        setCaseToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (caseToDelete) {
            setCases(cases.filter(c => c.id !== caseToDelete));
        }
        setShowDeleteModal(false);
        setCaseToDelete(null);
    };

    const removeChip = useCallback((chip: string) => {
        setTypedChips(prev => prev.filter(c => c !== chip));
    }, []);

    const clearAllChips = useCallback(() => {
        setTypedChips([]);
    }, []);

    const onMenuActionButton = (action: string, caseId: string) => {
        switch (action) {
            case 'edit':
                console.log('Edit case:', caseId);
                // TODO: Navigate to edit page or open edit modal
                break;
            case 'view':
                console.log('View case details:', caseId);
                // TODO: Navigate to details page
                break;
            case 'delete':
                deleteCase(caseId);
                break;
        }
    }

    const handleInputKeyPress = (event: GoabInputOnKeyPressDetail) => {
        if (event.key === "Enter") {
            const value = event.value;
            setTimeout(() => {
                applyFilter(value);
            }, 0);
        }
    };

    // Memoize header actions
    const headerActions = useMemo(() => (
        <GoabButtonGroup gap="compact" alignment={"start"}>
            <div><GoabButton type="secondary" size="compact">More</GoabButton></div>
            <div><GoabButton type="primary" size="compact">Add application</GoabButton></div>
        </GoabButtonGroup>
    ), []);

    // Memoize toolbar with tabs + search/sort/filter for header
    const headerToolbar = useMemo(() => (
        <div className="cases-toolbar-row">
            <GoabTabs initialTab={1} onChange={handleTabChange} stackOnMobile={false} variant="segmented">
                <GoabTab heading="All"/>
                <GoabTab heading={<>Assigned to me <GoabBadge type="information" content={String(myCasesCount)} emphasis="subtle" /></>}/>
                <GoabTab heading={<>In progress <GoabBadge type="important" content={String(inProgressCount)} emphasis="subtle" /></>}/>
                <GoabTab heading="Complete"/>
            </GoabTabs>
            <div className="cases-search-row">
                <div className="cases-search-group">
                    <GoabFormItem id="filterInput" error={inputError} labelSize="compact">
                        <GoabInput
                            name="filterInput"
                            value={inputValue}
                            leadingIcon="search"
                            width="100%"
                            size="compact"
                            placeholder="Search..."
                            onChange={(event: GoabInputOnChangeDetail) => {
                                setInputValue(event.value);
                                if (inputError) {
                                    setInputError("");
                                }
                            }}
                            onKeyPress={handleInputKeyPress}
                        />
                    </GoabFormItem>
                </div>
                <div className="cases-actions-group">
                    <GoabMenuButton
                        size="compact"
                        type="tertiary"
                        text="Sort"
                        onAction={(e: GoabMenuButtonOnActionDetail) => handleSortAction(e.action)}
                    >
                        <GoabMenuAction
                            text={`Status${getSortIndicator('status')}`}
                            action="sort-status"
                            icon={getSortIcon('status')}
                        />
                        <GoabMenuAction
                            text={`Due date${getSortIndicator('dueDate')}`}
                            action="sort-dueDate"
                            icon={getSortIcon('dueDate')}
                        />
                        <GoabMenuAction
                            text={`Jurisdiction${getSortIndicator('jurisdiction')}`}
                            action="sort-jurisdiction"
                            icon={getSortIcon('jurisdiction')}
                        />
                        <GoabMenuAction
                            text={`Priority${getSortIndicator('priority')}`}
                            action="sort-priority"
                            icon={getSortIcon('priority')}
                        />
                        {sortConfig.primary && (
                            <GoabMenuAction
                                text="Clear sort"
                                action="clear-sort"
                                variant="destructive"
                            />
                        )}
                    </GoabMenuButton>
                    <GoabButton
                        type="tertiary"
                        leadingIcon="filter-lines"
                        size="compact"
                        onClick={() => {
                            setPendingFilters(appliedFilters);
                            setFilterDrawerOpen(true);
                        }}
                    >
                        Filter
                    </GoabButton>
                </div>
            </div>
        </div>
    ), [myCasesCount, inProgressCount, inputValue, inputError, sortConfig, appliedFilters, handleTabChange, handleSortAction, getSortIndicator, getSortIcon, handleInputKeyPress, setPendingFilters, setFilterDrawerOpen, setInputValue, setInputError]);

    // Set up page header with title, actions, and toolbar (tabs now inside toolbar)
    usePageHeader("Cases", {
        actions: headerActions,
        toolbar: headerToolbar
    });

    // Table column definitions
    const caseColumns: TableColumn<Case>[] = useMemo(() => [
        {
            key: 'select',
            type: 'checkbox',
            headerRender: () => (
                <GoabCheckbox
                    name="selectAll"
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={() => {
                        const newValue = !isAllSelected && !isIndeterminate;
                        setCases(prev => prev.map(c => ({ ...c, selected: newValue })));
                    }}
                    ariaLabel="Select all cases"
                />
            ),
            render: (caseItem) => (
                <GoabCheckbox
                    name={`select-${caseItem.id}`}
                    checked={caseItem.selected}
                    onChange={() => {
                        setCases(prev => prev.map(c =>
                            c.id === caseItem.id ? { ...c, selected: !c.selected } : c
                        ));
                    }}
                    ariaLabel={`Select ${caseItem.name}`}
                />
            ),
        },
        {
            key: 'name',
            header: 'Name',
            type: 'link',
            render: (caseItem) => (
                <Link to={`/case/${caseItem.id}`} className="table-row-link">{caseItem.name}</Link>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            type: 'badge',
            sortable: true,
            render: (caseItem) => (
                <GoabBadge type={caseItem.status} content={caseItem.statusText} emphasis="subtle" icon={true} />
            ),
        },
        {
            key: 'staff',
            header: 'Assigned to',
            type: 'text',
            render: (caseItem) => caseItem.staff || '—',
        },
        {
            key: 'dueDate',
            header: 'Due date',
            type: 'text',
            sortable: true,
            render: (caseItem) => caseItem.dueDate || '—',
        },
        {
            key: 'jurisdiction',
            header: 'Jurisdiction',
            type: 'text',
            sortable: true,
            render: (caseItem) => caseItem.jurisdiction || '—',
        },
        {
            key: 'fileNumber',
            header: 'File number',
            type: 'text',
            render: (caseItem) => caseItem.fileNumber || '—',
        },
        {
            key: 'priority',
            header: 'Priority',
            type: 'badge',
            sortable: true,
            render: (caseItem) => caseItem.priority ? <GoabBadge {...getPriorityBadgeProps(caseItem.priority)} /> : '—',
        },
        {
            key: 'actions',
            type: 'actions',
            render: (caseItem) => (
                <GoabMenuButton
                    leadingIcon="ellipsis-horizontal"
                    leadingIconTheme="filled"
                    size="compact"
                    onAction={(e: GoabMenuButtonOnActionDetail) => onMenuActionButton(e.action, caseItem.id)}
                >
                    <GoabMenuAction text="View case" action="view" />
                    <GoabMenuAction text="Assign to me" action="assign" />
                    <GoabMenuAction text="Delete" icon="trash" action="delete" variant="destructive" />
                </GoabMenuButton>
            ),
        },
    ], [isAllSelected, isIndeterminate, setCases, onMenuActionButton]);

    const emptyStateContent = (
        <EmptyState onButtonClick={clearAllChips} />
    );

    // @ts-ignore
    return (
        <div style={{maxWidth: "100%", overflow: "hidden", paddingBottom: "32px"}}>
            {/* Filter chips section (shown below header) */}
            <div className="cases-content-padding">
                {(typedChips.length > 0 || filterChips.length > 0 || sortConfig.primary) && (
                    <div className="cases-chips-container">
                        <GoabIcon type="filter-lines" size="small" fillColor="var(--goa-color-text-secondary)" mr="2xs"/>
                        {/* Sort chips */}
                        {sortConfig.primary && (
                            <GoabFilterChip
                                key={`sort-primary-${sortConfig.primary.key}`}
                                content={sortFieldLabels[sortConfig.primary.key]}
                                leadingIcon={sortConfig.primary.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                                secondaryText={sortConfig.secondary ? "1st" : undefined}
                                onClick={() => {
                                    // Promote secondary to primary, clear secondary
                                    setSortConfig({ primary: sortConfig.secondary, secondary: null });
                                }}
                            />
                        )}
                        {sortConfig.secondary && (
                            <GoabFilterChip
                                key={`sort-secondary-${sortConfig.secondary.key}`}
                                content={sortFieldLabels[sortConfig.secondary.key]}
                                leadingIcon={sortConfig.secondary.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                                secondaryText="2nd"
                                onClick={() => setSortConfig(prev => ({ ...prev, secondary: null }))}
                            />
                        )}
                        {/* Search chips */}
                        {typedChips.map((chip) => (
                            <GoabFilterChip
                                key={`search-${chip}`}
                                content={chip}
                                onClick={() => removeChip(chip)}
                            />
                        ))}
                        {/* Filter chips */}
                        {filterChips.map((chip) => (
                            <GoabFilterChip
                                key={`${chip.category}-${chip.value}`}
                                content={chip.label}
                                onClick={() => removeAppliedFilter(chip.category, chip.value)}
                            />
                        ))}
                        <GoabLink color="dark" size="small">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    clearAllChips();
                                    clearAllFilters();
                                    clearSort();
                                }}
                            >
                                Clear all
                            </a>
                        </GoabLink>
                    </div>
                )}
            </div>

            {/* Table/List/Card view section */}
            {viewMode === 'table' && (
                <DataTable
                    columns={caseColumns}
                    data={filteredCases}
                    isLoading={isLoading}
                    skeletonRows={10}
                    onSort={handleTableSort}
                    sortConfig={sortConfig}
                    emptyState={cases.length > 0 ? emptyStateContent : undefined}
                    getRowKey={(caseItem) => caseItem.id}
                    getRowSelected={(caseItem) => caseItem.selected}
                    onRowClick={(caseItem) => {
                        setCases(prev => prev.map(c =>
                            c.id === caseItem.id ? { ...c, selected: !c.selected } : c
                        ));
                    }}
                />
            )}

            {viewMode === 'list' && (
                <div className="cases-content-padding">
                    {filteredCases.length === 0 && cases.length > 0 ? (
                        emptyStateContent
                    ) : (
                        <ExpandableListView
                            data={filteredCases}
                            isLoading={isLoading}
                            getRowKey={(caseItem) => caseItem.id}
                            renderCollapsed={(caseItem) => ({
                                title: <span className="expandable-list__name">{caseItem.name}</span>,
                                badge: <GoabBadge type={caseItem.status} content={caseItem.statusText} emphasis="subtle" icon={true} />,
                                secondaryInfo: (
                                    <div className="expandable-list__header-actions">
                                        {caseItem.comments > 0 && (
                                            <GoabLink leadingIcon="chatbox" color="dark" size="small">
                                                <a href="#">{caseItem.comments} comment{caseItem.comments === 1 ? '' : 's'}</a>
                                            </GoabLink>
                                        )}
                                    </div>
                                ),
                                actions: (
                                    <GoabButton
                                        type="tertiary"
                                        size="compact"
                                        onClick={() => onMenuActionButton('view', caseItem.id)}
                                    >
                                        View
                                    </GoabButton>
                                ),
                            })}
                            renderExpanded={(caseItem) => (
                                <div className="case-card__sections">
                                    {/* Identification section */}
                                    <div className="case-card__section">
                                        <div className="case-card__section-heading">Identification</div>
                                        <div className="case-card__section-fields">
                                            <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                                                <span className="case-card__label">File number</span>
                                                <span className="case-card__value">{caseItem.fileNumber || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                                                <span className="case-card__label">Jurisdiction</span>
                                                <span className="case-card__value">{caseItem.jurisdiction || '—'}</span>
                                            </GoabBlock>
                                        </div>
                                    </div>
                                    {/* Assignment section */}
                                    <div className="case-card__section">
                                        <div className="case-card__section-heading">Assignment</div>
                                        <div className="case-card__section-fields">
                                            <GoabBlock direction="column" gap="xs" data-grid="cell-8">
                                                <span className="case-card__label">Assigned to</span>
                                                <span className="case-card__value">{caseItem.staff || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="xs" data-grid="cell-9">
                                                <span className="case-card__label">Due date</span>
                                                <span className="case-card__value">{caseItem.dueDate || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="xs" data-grid="cell-10">
                                                <span className="case-card__label">Category</span>
                                                <span className="case-card__value">
                                                    {caseItem.category === 'todo' ? 'To do' :
                                                        caseItem.category === 'progress' ? 'In progress' :
                                                            caseItem.category === 'complete' ? 'Complete' :
                                                                caseItem.category || '—'}
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

            {viewMode === 'card' && (
                /* Card View */
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
                                        <div className="case-card__row">
                                            <GoabBlock direction="column" gap="2xs">
                                                <GoabSkeleton type="text-small" maxWidth="60px" />
                                                <GoabSkeleton type="text" maxWidth="100px" />
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs">
                                                <GoabSkeleton type="text-small" maxWidth="50px" />
                                                <GoabSkeleton type="text" maxWidth="80px" />
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs">
                                                <GoabSkeleton type="text-small" maxWidth="70px" />
                                                <GoabSkeleton type="text" maxWidth="90px" />
                                            </GoabBlock>
                                        </div>
                                        <div className="case-card__row">
                                            <GoabBlock direction="column" gap="2xs">
                                                <GoabSkeleton type="text-small" maxWidth="65px" />
                                                <GoabSkeleton type="text" maxWidth="110px" />
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs">
                                                <GoabSkeleton type="text-small" maxWidth="45px" />
                                                <GoabSkeleton type="text" maxWidth="70px" />
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs">
                                                <GoabSkeleton type="text-small" maxWidth="55px" />
                                                <GoabSkeleton type="text" maxWidth="85px" />
                                            </GoabBlock>
                                        </div>
                                    </div>
                                </GoabContainer>
                                </div>
                            ))}
                        </div>
                    ) : filteredCases.length === 0 && cases.length > 0 ? (
                        <EmptyState onButtonClick={clearAllChips} />
                    ) : (
                        <div className="cases-card-grid">
                            {filteredCases.map((caseItem) => (
                                <GoabContainer
                                    key={caseItem.id}
                                    accent="thick"
                                    type="non-interactive"
                                    padding="compact"
                                    mb="none"
                                    data-grid="row"
                                    heading={
                                        <div className="case-card__title">
                                            <GoabText size="heading-xs" mt={"none"} mb={"none"} data-grid={"cell-1"}>{caseItem.name}</GoabText>
                                            <GoabBadge data-grid={"cell-2"}
                                                type={caseItem.status}
                                                content={caseItem.statusText}
                                                emphasis="subtle"
                                                icon={true}
                                            />
                                        </div>
                                    }
                                    actions={
                                    <div data-grid={"cell-3"} className="case-card__actions">
                                        {caseItem.comments > 0 && (
                                            <GoabLink leadingIcon="chatbox" color="dark" size="small">
                                                <a href="#">{caseItem.comments} comment{caseItem.comments === 1 ? '' : 's'}</a>
                                            </GoabLink>
                                        )}
                                        {activeTab === 'todo' ? (
                                            <GoabButton
                                                type="tertiary"
                                                size="compact"
                                                onClick={() => onMenuActionButton('start', caseItem.id)}
                                            >
                                                Start
                                            </GoabButton>
                                        ) : (
                                            <GoabMenuButton
                                                leadingIcon="ellipsis-horizontal"
                                                leadingIconTheme="filled"
                                                size="compact"
                                                onAction={(e: GoabMenuButtonOnActionDetail) => onMenuActionButton(e.action, caseItem.id)}
                                            >
                                                <GoabMenuAction text="Continue" action="continue" />
                                                <GoabMenuAction text="Unassign me" action="unassign" />
                                                <GoabMenuAction text="Mark as complete" action="complete" />
                                            </GoabMenuButton>
                                        )}
                                    </div>
                                    }
                                >
                                    <div className="case-card__body">
                                        <div className="case-card__sections">
                                            {/* Identification section */}
                                            <div className="case-card__section">
                                                <div className="case-card__section-heading">Identification</div>
                                                <div className="case-card__section-fields">
                                                    <GoabBlock direction="column" gap="xs" data-grid="cell-4">
                                                        <span className="case-card__label">File number</span>
                                                        <span className="case-card__value">{caseItem.fileNumber || '—'}</span>
                                                    </GoabBlock>
                                                    <GoabBlock direction="column" gap="xs" data-grid="cell-5">
                                                        <span className="case-card__label">Jurisdiction</span>
                                                        <span className="case-card__value">{caseItem.jurisdiction || '—'}</span>
                                                    </GoabBlock>
                                                </div>
                                            </div>
                                            {/* Assignment section */}
                                            <div className="case-card__section">
                                                <div className="case-card__section-heading">Assignment</div>
                                                <div className="case-card__section-fields">
                                                    <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                                                        <span className="case-card__label">Assigned to</span>
                                                        <span className="case-card__value">{caseItem.staff || '—'}</span>
                                                    </GoabBlock>
                                                    <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                                                        <span className="case-card__label">Due date</span>
                                                        <span className="case-card__value">{caseItem.dueDate || '—'}</span>
                                                    </GoabBlock>
                                                    <GoabBlock direction="column" gap="xs" data-grid="cell-8">
                                                        <span className="case-card__label">Category</span>
                                                        <span className="case-card__value">
                                                            {caseItem.category === 'todo' ? 'To do' :
                                                                caseItem.category === 'progress' ? 'In progress' :
                                                                    caseItem.category === 'complete' ? 'Complete' :
                                                                        caseItem.category || '—'}
                                                        </span>
                                                    </GoabBlock>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GoabContainer>
                            ))}
                        </div>
                    )}
                    </GoabDataGrid>
                </div>
            )}

            <GoabModal
                heading="Delete case record"
                open={showDeleteModal}
                calloutVariant="emergency"
                actions={
                    <GoabButtonGroup alignment="end">
                        <GoabButton type="tertiary" size="compact" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </GoabButton>
                        <GoabButton type="primary" size="compact" variant="destructive" onClick={confirmDelete}>
                            Delete
                        </GoabButton>
                    </GoabButtonGroup>
                }
            >
                <GoabText mt="none" mb="none">
                    Are you sure you want to delete this case record? This action cannot be undone.
                </GoabText>
            </GoabModal>

            <GoabDrawer
                heading="Filter cases"
                position="right"
                open={filterDrawerOpen}
                maxSize="300px"
                onClose={() => setFilterDrawerOpen(false)}
                actions={
                    <GoabButtonGroup alignment="start" gap="compact">
                        <GoabButton type="primary" size="compact" onClick={applyFilters}>
                            Apply filters
                        </GoabButton>
                        <GoabButton type="tertiary" size="compact" onClick={() => setFilterDrawerOpen(false)}>
                            Cancel
                        </GoabButton>
                    </GoabButtonGroup>
                }
            >
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-l)'}}>
                    {/* Status filter */}
                    <GoabFormItem label="Status">
                        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)'}}>
                            {filterOptions.statuses.map(status => (
                                <GoabCheckbox
                                    key={status}
                                    name={`status-${status}`}
                                    text={status}
                                    checked={pendingFilters.status.includes(status)}
                                    onChange={() => togglePendingFilter('status', status)}
                                />
                            ))}
                        </div>
                    </GoabFormItem>

                    {/* Priority filter */}
                    <GoabFormItem label="Priority">
                        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)'}}>
                            {filterOptions.priorities.map(priority => (
                                <GoabCheckbox
                                    key={priority}
                                    name={`priority-${priority}`}
                                    text={priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    checked={pendingFilters.priority.includes(priority)}
                                    onChange={() => togglePendingFilter('priority', priority)}
                                />
                            ))}
                        </div>
                    </GoabFormItem>

                    {/* Assigned to filter */}
                    <GoabFormItem label="Assigned to">
                        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)'}}>
                            {filterOptions.staffMembers.map(staff => (
                                <GoabCheckbox
                                    key={staff}
                                    name={`staff-${staff}`}
                                    text={staff}
                                    checked={pendingFilters.staff.includes(staff)}
                                    onChange={() => togglePendingFilter('staff', staff)}
                                />
                            ))}
                        </div>
                    </GoabFormItem>

                    {/* Jurisdiction filter */}
                    <GoabFormItem label="Jurisdiction">
                        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)'}}>
                            {filterOptions.jurisdictions.map(jurisdiction => (
                                <GoabCheckbox
                                    key={jurisdiction}
                                    name={`jurisdiction-${jurisdiction}`}
                                    text={jurisdiction}
                                    checked={pendingFilters.jurisdiction.includes(jurisdiction)}
                                    onChange={() => togglePendingFilter('jurisdiction', jurisdiction)}
                                />
                            ))}
                        </div>
                    </GoabFormItem>

                    {/* Clear all button */}
                    {Object.values(pendingFilters).some(arr => arr.length > 0) && (
                        <>
                            <GoabDivider/>
                            <GoabButton type="tertiary" size="compact" onClick={() => setPendingFilters({
                                status: [],
                                priority: [],
                                jurisdiction: [],
                                staff: []
                            })}>
                                Clear all filters
                            </GoabButton>
                        </>
                    )}
                </div>
            </GoabDrawer>
        </div>
    );
}
