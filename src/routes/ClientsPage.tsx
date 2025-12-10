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
    GoabLink,
    GoabIcon,
    GoabModal,
    GoabButtonGroup,
    GoabDropdown,
    GoabDropdownItem,
    GoabDrawer,
    GoabSkeleton,
    GoabDivider, GoabMenuButton, GoabMenuAction, GoabIconButton, GoabTooltip, GoabContainer, GoabBlock, GoabDataGrid,
} from "@abgov/react-components";
import emptyStateIllustration from "../assets/empty-state-illustration.svg";
import {filterData, sortData} from "../utils/searchUtils";
import {getPriorityBadgeProps} from "../utils/badgeUtils";
import {usePageHeader} from "../contexts/PageHeaderContext";
import {
    GoabInputOnChangeDetail,
    GoabInputOnKeyPressDetail,
    GoabMenuButtonOnActionDetail,
    GoabTableOnSortDetail
} from "@abgov/ui-components-common";
import {Client} from "../types/Client";
import {TableColumn} from "../types/TableColumn";
import mockData from "../data/mockClients.json";
import {mockFetch} from "../utils/mockApi";
import {DataTable} from "../components/DataTable";

export function ClientsPage() {
    // Memoize actions to prevent infinite re-renders
    const headerActions = useMemo(() => (
        <>
            <GoabButtonGroup gap="compact" alignment={"start"}>
                <div><GoabButton type="secondary" size="compact">More</GoabButton></div>
                <div><GoabButton type="primary" size="compact">Add application</GoabButton></div>
            </GoabButtonGroup>
        </>
    ), []);
    // Set up page header with title and actions
    usePageHeader("Clients", headerActions);

    const [activeTab, setActiveTab] = useState('all');
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const [typedChips, setTypedChips] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: string,
        direction: 'asc' | 'desc' | 'none'
    }>({key: '', direction: 'none'});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'card'>(() => {
        const saved = localStorage.getItem('clientsViewMode');
        return (saved === 'table' || saved === 'card') ? saved : 'table';
    });

    // Save view mode to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('clientsViewMode', viewMode);
    }, [viewMode]);

    // Simulate fetching clients from an API
    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            const data = await mockFetch<Client[]>(mockData as Client[]);
            setClients(data);
            setIsLoading(false);
        };
        fetchClients();
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
        const statuses = [...new Set(clients.map(c => c.statusText))].sort();
        const priorities = ['high', 'medium', 'low'];
        const jurisdictions = [...new Set(clients.map(c => c.jurisdiction))].sort();
        const staffMembers = [...new Set(clients.map(c => c.staff))].sort();
        return {statuses, priorities, jurisdictions, staffMembers};
    }, [clients]);

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

    const filteredClients = useMemo(() => {
        let filtered = clients;
        if (activeTab !== 'all') {
            filtered = clients.filter(client => client.category === activeTab);
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

        return sortData(filtered, sortConfig.key, sortConfig.direction);
    }, [clients, activeTab, typedChips, sortConfig, appliedFilters]);

    // Calculate selection state for header checkbox
    const selectedCount = useMemo(() =>
        filteredClients.filter(c => c.selected).length,
        [filteredClients]
    );
    const isAllSelected = selectedCount > 0 && selectedCount === filteredClients.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < filteredClients.length;

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

    const handleSort = (event: GoabTableOnSortDetail) => {
        const {sortBy, sortDir} = event;
        setSortConfig({
            key: sortBy as keyof Client | '',
            direction: sortDir === 1 ? 'asc' : sortDir === -1 ? 'desc' : 'none'
        });
    };

    const deleteClient = (id: string) => {
        setClientToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (clientToDelete) {
            setClients(clients.filter(c => c.id !== clientToDelete));
        }
        setShowDeleteModal(false);
        setClientToDelete(null);
    };

    const removeChip = useCallback((chip: string) => {
        setTypedChips(prev => prev.filter(c => c !== chip));
    }, []);

    const clearAllChips = useCallback(() => {
        setTypedChips([]);
    }, []);

    const onMenuActionButton = (action: string, clientId: string) => {
        switch (action) {
            case 'edit':
                console.log('Edit client:', clientId);
                // TODO: Navigate to edit page or open edit modal
                break;
            case 'view':
                console.log('View client details:', clientId);
                // TODO: Navigate to details page
                break;
            case 'delete':
                deleteClient(clientId);
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

    // Table column definitions
    const clientColumns: TableColumn<Client>[] = useMemo(() => [
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
                        setClients(prev => prev.map(c => ({ ...c, selected: newValue })));
                    }}
                    ariaLabel="Select all clients"
                />
            ),
            render: (client) => (
                <GoabCheckbox
                    name={`select-${client.id}`}
                    checked={client.selected}
                    onChange={() => {
                        setClients(prev => prev.map(c =>
                            c.id === client.id ? { ...c, selected: !c.selected } : c
                        ));
                    }}
                    ariaLabel={`Select ${client.name}`}
                />
            ),
        },
        {
            key: 'status',
            header: 'Status',
            type: 'badge',
            sortable: true,
            render: (client) => (
                <GoabBadge type={client.status} content={client.statusText} emphasis="subtle" icon={true} />
            ),
        },
        {
            key: 'name',
            header: 'Name',
            type: 'link',
            render: (client) => (
                <Link to={`/client/${client.id}`} className="table-row-link">{client.name}</Link>
            ),
        },
        {
            key: 'staff',
            header: 'Assigned to',
            type: 'text',
            render: (client) => client.staff || '—',
        },
        {
            key: 'dueDate',
            header: 'Due date',
            type: 'text',
            sortable: true,
            render: (client) => client.dueDate || '—',
        },
        {
            key: 'jurisdiction',
            header: 'Jurisdiction',
            type: 'text',
            sortable: true,
            render: (client) => client.jurisdiction || '—',
        },
        {
            key: 'fileNumber',
            header: 'File number',
            type: 'text',
            render: (client) => client.fileNumber || '—',
        },
        {
            key: 'category',
            header: 'Category',
            type: 'text',
            render: (client) => {
                if (client.category === 'todo') return 'To do';
                if (client.category === 'progress') return 'In progress';
                if (client.category === 'complete') return 'Complete';
                return client.category || '—';
            },
        },
        {
            key: 'priority',
            header: 'Priority',
            type: 'badge',
            sortable: true,
            render: (client) => client.priority ? <GoabBadge {...getPriorityBadgeProps(client.priority)} /> : '—',
        },
        {
            key: 'notes',
            header: 'Notes',
            type: 'text',
            render: (client) => client.priority === 'high' ? 'Requires immediate attention' : client.priority ? 'Standard processing' : '—',
        },
        {
            key: 'actions',
            type: 'actions',
            render: (client) => (
                <GoabMenuButton
                    leadingIcon="ellipsis-horizontal"
                    leadingIconTheme="filled"
                    size="compact"
                    onAction={(e: GoabMenuButtonOnActionDetail) => onMenuActionButton(e.action, client.id)}
                >
                    <GoabMenuAction text="View client" action="view" />
                    <GoabMenuAction text="Edit" action="edit" />
                    <GoabMenuAction text="Delete" icon="trash" action="delete" variant="destructive" />
                </GoabMenuButton>
            ),
        },
    ], [isAllSelected, isIndeterminate, setClients, onMenuActionButton]);

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

    // @ts-ignore
    return (
        <div style={{maxWidth: "100%", overflow: "hidden", paddingBottom: "32px"}}>
            {/* Padding section - tabs + filter row, chips */}
            <div className="clients-content-padding">
                <div className="clients-filter-section">
                    <GoabTabs initialTab={1} onChange={handleTabChange} stackOnMobile={false}>
                        <GoabTab heading="All"/>
                        <GoabTab heading="To do"/>
                        <GoabTab heading="In progress"/>
                        <GoabTab heading="Complete"/>
                    </GoabTabs>
                    <GoabFormItem id="filterInput" error={inputError} labelSize="compact">
                        <div className="clients-search-row">
                            <div className="clients-search-group">
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
                                <div>
                                    <GoabButton type="tertiary" onClick={() => applyFilter()} size="compact">
                                        Search
                                    </GoabButton>
                                </div>
                            </div>
                            <div className="clients-actions-group">
                                <GoabDropdown
                                    value={sortConfig.key || ''}
                                    onChange={(e) => {
                                        const key = e.value as keyof Client;
                                        if (key) {
                                            setSortConfig({key, direction: 'asc'});
                                        }
                                    }}
                                    placeholder="— Sort by —"
                                    size="compact"
                                    width="160px"
                                >
                                    <GoabDropdownItem value="status" label="Status"/>
                                    <GoabDropdownItem value="dueDate" label="Due date"/>
                                    <GoabDropdownItem value="jurisdiction" label="Jurisdiction"/>
                                    <GoabDropdownItem value="priority" label="Priority"/>
                                </GoabDropdown>
                                <GoabButton
                                    type="tertiary"
                                    leadingIcon="filter"
                                    size="compact"
                                    onClick={() => {
                                        setPendingFilters(appliedFilters);
                                        setFilterDrawerOpen(true);
                                    }}
                                >
                                    Filter
                                </GoabButton>
                                <div className="view-toggle">
                                    <GoabTooltip position={"bottom"} content="Switch to table view">
                                        <GoabIconButton
                                            icon="list"
                                            size="small"
                                            variant={viewMode === 'table' ? 'color' : 'dark'}
                                            onClick={() => setViewMode('table')}
                                            ariaLabel="Table view"
                                        />
                                    </GoabTooltip>
                                    <GoabTooltip position={"bottom"} content="Switch to data card view">
                                        <GoabIconButton
                                            icon="grid"
                                            size="small"
                                            variant={viewMode === 'card' ? 'color' : 'dark'}
                                            onClick={() => setViewMode('card')}
                                            ariaLabel="Card view"
                                        />
                                    </GoabTooltip>
                                </div>
                            </div>
                        </div>
                    </GoabFormItem>
                </div>

                {(typedChips.length > 0 || filterChips.length > 0) && (
                    <div className="clients-chips-container">
                        <GoabIcon type="filter" size="small" fillColor="var(--goa-color-text-secondary)" mr="2xs"/>
                        {typedChips.map((chip) => (
                            <GoabFilterChip
                                key={`search-${chip}`}
                                content={chip}
                                onClick={() => removeChip(chip)}
                            />
                        ))}
                        {filterChips.map((chip) => (
                            <GoabFilterChip
                                key={`${chip.category}-${chip.value}`}
                                content={chip.label}
                                onClick={() => removeAppliedFilter(chip.category, chip.value)}
                            />
                        ))}
                        <GoabButton size={"compact"} type="tertiary" onClick={() => {
                            clearAllChips();
                            clearAllFilters();
                        }}>
                            Clear all
                        </GoabButton>
                    </div>
                )}
            </div>

            {/* Table/Card view section */}
            {viewMode === 'table' ? (
                <DataTable
                    columns={clientColumns}
                    data={filteredClients}
                    isLoading={isLoading}
                    skeletonRows={10}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    emptyState={clients.length > 0 ? emptyStateContent : undefined}
                    getRowKey={(client) => client.id}
                    getRowSelected={(client) => client.selected}
                />
            ) : (
                /* Card View */
                <div className="clients-content-padding">
                    <GoabDataGrid keyboardNav="layout" keyboardIconPosition="right">
                    {isLoading ? (
                        <div className="clients-card-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} data-grid="row">
                                <GoabContainer
                                    accent="thick"
                                    type="non-interactive"
                                    padding="compact"
                                    mb="none"
                                    heading={
                                        <div className="client-card__title">
                                            <GoabSkeleton type="title" maxWidth="200px" />
                                            <GoabSkeleton type="text" maxWidth="80px" />
                                        </div>
                                    }
                                    actions={
                                        <GoabSkeleton type="text" maxWidth="40px" />
                                    }
                                >
                                    <div className="client-card__body">
                                        <div className="client-card__row">
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
                                        <div className="client-card__row">
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
                    ) : filteredClients.length === 0 && clients.length > 0 ? (
                        <div className="clients-empty-state">
                            <img src={emptyStateIllustration} alt="" className="clients-empty-state__illustration"/>
                            <span className="clients-empty-state__heading">No results found</span>
                            <span className="clients-empty-state__subline">Try adjusting your search or filters.</span>
                            <GoabButton type="tertiary" size="compact" onClick={clearAllChips}>
                                Clear filters
                            </GoabButton>
                        </div>
                    ) : (
                        <div className="clients-card-grid">
                            {filteredClients.map((client) => (
                                <GoabContainer
                                    key={client.id}
                                    accent="thick"
                                    type="non-interactive"
                                    padding="compact"
                                    mb="none"
                                    data-grid="row"
                                    heading={
                                        <div className="client-card__title">
                                            <GoabText size="heading-s" mt={"none"} mb={"none"} data-grid={"cell-1"}>{client.name}</GoabText>
                                            <GoabBadge data-grid={"cell-2"}
                                                type={client.status}
                                                content={client.statusText}
                                                emphasis="subtle"
                                                icon={true}
                                            />
                                        </div>
                                    }
                                    actions={
                                    <div data-grid={"cell-3"}>
                                        <GoabMenuButton
                                            leadingIcon={"ellipsis-horizontal"}
                                            leadingIconTheme={"filled"}
                                            size="compact"
                                            onAction={(e: GoabMenuButtonOnActionDetail) => onMenuActionButton(e.action, client.id)}
                                        >
                                            <GoabMenuAction text={"View client"} action={"view"}></GoabMenuAction>
                                            <GoabMenuAction text={"Edit"} action={"edit"}></GoabMenuAction>
                                            <GoabMenuAction text={"Delete"} icon={"trash"} action={"delete"} variant={"destructive"}></GoabMenuAction>
                                        </GoabMenuButton>
                                    </div>
                                    }
                                >
                                    <div className="client-card__body">
                                        <div className="client-card__row client-card__row--4col">
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-4">
                                                <span className="client-card__label">Assigned to</span>
                                                <span className="client-card__value">{client.staff || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-5">
                                                <span className="client-card__label">Due date</span>
                                                <span className="client-card__value">{client.dueDate || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-6">
                                                <span className="client-card__label">Jurisdiction</span>
                                                <span className="client-card__value">{client.jurisdiction || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-7">
                                                <span className="client-card__label">File number</span>
                                                <span className="client-card__value">{client.fileNumber || '—'}</span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-8">
                                                <span className="client-card__label">Priority</span>
                                                <span className="client-card__value">
                                                    {client.priority ? <GoabBadge {...getPriorityBadgeProps(client.priority)} /> : '—'}
                                                </span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-9">
                                                <span className="client-card__label">Category</span>
                                                <span className="client-card__value">
                                                    {client.category === 'todo' ? 'To do' :
                                                        client.category === 'progress' ? 'In progress' :
                                                            client.category === 'complete' ? 'Complete' :
                                                                client.category || '—'}
                                                </span>
                                            </GoabBlock>
                                            <GoabBlock direction="column" gap="2xs" data-grid="cell-10">
                                                <span className="client-card__label">Notes</span>
                                                <span className="client-card__value">
                                                    {client.priority === 'high' ? 'Requires immediate attention' : client.priority ? 'Standard processing' : '—'}
                                                </span>
                                            </GoabBlock>
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
                heading="Delete client record"
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
                    Are you sure you want to delete this client record? This action cannot be undone.
                </GoabText>
            </GoabModal>

            <GoabDrawer
                heading="Filter clients"
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
