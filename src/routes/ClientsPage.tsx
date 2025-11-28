import React, {useState, useMemo, useCallback, useEffect} from "react";
import {Link} from "react-router-dom";
import {
    GoabText,
    GoabButton,
    GoabTabs,
    GoabTab,
    GoabFormItem,
    GoabBlock,
    GoabInput,
    GoabFilterChip,
    GoabTable,
    GoabTableSortHeader,
    GoabCheckbox,
    GoabBadge,
    GoabLink,
    GoabIcon,
    GoabModal,
    GoabButtonGroup,
    GoabDataGrid,
    GoabPopover,
    GoabDropdown,
    GoabDropdownItem,
    GoabDrawer,
    GoabCircularProgress,
    GoabDivider,
} from "@abgov/react-components";
import emptyStateIllustration from "../assets/empty-state-illustration.svg";
import {filterData, sortData} from "../utils/searchUtils";
import {getPriorityBadgeProps} from "../utils/badgeUtils";
import {usePageHeader} from "../contexts/PageHeaderContext";
import {useMenu} from "../contexts/MenuContext";
import {ScrollContainer} from "../components/ScrollContainer";
import {GoabInputOnChangeDetail, GoabInputOnKeyPressDetail, GoabTableOnSortDetail} from "@abgov/ui-components-common";
import {Client} from "../types/Client";
import mockData from "../data/mockClients.json";
import {mockFetch} from "../utils/mockApi";

export function ClientsPage() {
    const {isMobile} = useMenu();

    // Memoize actions to prevent infinite re-renders
    const headerActions = useMemo(() => (
        <>
            <GoabButtonGroup gap="compact">
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
    const [allSelected, setAllSelected] = useState(false);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Client | '',
        direction: 'asc' | 'desc' | 'none'
    }>({key: '', direction: 'none'});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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
        return { statuses, priorities, jurisdictions, staffMembers };
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
        const emptyFilters = { status: [], priority: [], jurisdiction: [], staff: [] };
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
        appliedFilters.status.forEach(v => chips.push({ category: 'status', value: v, label: v }));
        appliedFilters.priority.forEach(v => chips.push({ category: 'priority', value: v, label: v.charAt(0).toUpperCase() + v.slice(1) + ' priority' }));
        appliedFilters.staff.forEach(v => chips.push({ category: 'staff', value: v, label: v }));
        appliedFilters.jurisdiction.forEach(v => chips.push({ category: 'jurisdiction', value: v, label: v }));
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

    const handleRowAction = useCallback((action: string, clientId: string, event: Event) => {
        // Close the popover by dispatching a close event
        (event.target as HTMLElement)?.dispatchEvent(new CustomEvent('close', { bubbles: true }));

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
    }, []);

    const handleInputKeyPress = (event: GoabInputOnKeyPressDetail) => {
        if (event.key === "Enter") {
            const value = event.value;
            setTimeout(() => {
                applyFilter(value);
            }, 0);
        }
    };

    // @ts-ignore
    return (
        <div style={{maxWidth: "100%", overflow: "hidden", paddingBottom: "32px"}}>
                        {/* Padding section - tabs + filter row, chips */}
            <div className="clients-content-padding">
                <div className="clients-filter-section">
                    <GoabTabs initialTab={1} onChange={handleTabChange}>
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
                                            setSortConfig({ key, direction: 'asc' });
                                        }
                                    }}
                                    placeholder="— Sort by —"
                                    size="compact"
                                    width="160px"
                                >
                                    <GoabDropdownItem value="dueDate" label="Due date" />
                                    <GoabDropdownItem value="priority" label="Priority" />
                                    <GoabDropdownItem value="jurisdiction" label="Jurisdiction" />
                                </GoabDropdown>
                                <div>
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
                                </div>
                            </div>
                        </div>
                    </GoabFormItem>
                </div>

                {(typedChips.length > 0 || filterChips.length > 0) && (
                    <div className="clients-chips-container">
                        <GoabIcon type="filter" size="small" fillColor="var(--goa-color-text-secondary)" mr="2xs" />
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
                        <button
                            type="button"
                            className="clear-all-link"
                            onClick={() => {
                                clearAllChips();
                                clearAllFilters();
                            }}
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Table section - scroll container goes edge-to-edge, table has its own margins */}
            {isLoading ? (
                <div className="clients-content-padding">
                    <div className="clients-loading-state">
                        <GoabCircularProgress variant="inline" size="small" message="Loading clients..." visible={true} />
                    </div>
                </div>
            ) : (
            <ScrollContainer>
                <div className="clients-table-wrapper">
                    <GoabDataGrid keyboardNav="table" keyboardIcon={false}>
                        <GoabTable width="100%" onSort={handleSort} variant={isMobile ? "normal" : "relaxed"} striped={true}>
                        <thead>
                        <tr data-grid="row">
                            <th data-grid="cell" className="goa-table-cell--checkbox" style={{paddingBottom: 0}}>
                                <GoabCheckbox name="selectAll" checked={allSelected}
                                              onChange={() => {
                                                  const newValue = !allSelected;
                                                  setAllSelected(newValue);
                                                  setClients(prev => prev.map(c => ({ ...c, selected: newValue })));
                                              }}
                                              ariaLabel="Select all clients"/>
                            </th>
                            <th data-grid="cell"><GoabTableSortHeader name="status" direction={sortConfig.key === 'status' ? sortConfig.direction : 'none'}>Status</GoabTableSortHeader></th>
                            <th data-grid="cell">Name</th>
                            <th data-grid="cell">Assigned to</th>
                            <th data-grid="cell"><GoabTableSortHeader name="dueDate" direction={sortConfig.key === 'dueDate' ? sortConfig.direction : 'none'}>Due date</GoabTableSortHeader></th>
                            <th data-grid="cell"><GoabTableSortHeader
                                name="jurisdiction" direction={sortConfig.key === 'jurisdiction' ? sortConfig.direction : 'none'}>Jurisdiction</GoabTableSortHeader></th>
                            <th data-grid="cell">File number</th>
                            <th data-grid="cell">Category</th>
                            <th data-grid="cell"><GoabTableSortHeader name="priority" direction={sortConfig.key === 'priority' ? sortConfig.direction : 'none'}>Priority</GoabTableSortHeader>
                            </th>
                            <th data-grid="cell">Notes</th>
                            <th data-grid="cell"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredClients.length === 0 && clients.length > 0 ? (
                            <tr>
                                <td colSpan={11} className="clients-empty-state-cell">
                                    <div className="clients-empty-state">
                                        <img src={emptyStateIllustration} alt="" className="clients-empty-state__illustration" />
                                        <span className="clients-empty-state__heading">No results found</span>
                                        <span className="clients-empty-state__subline">Try adjusting your search or filters.</span>
                                        <GoabButton type="tertiary" size="compact" onClick={clearAllChips}>
                                            Clear filters
                                        </GoabButton>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredClients.map((client) => (
                                <tr key={client.id} data-grid="row">
                                    <td data-grid="cell" className="goa-table-cell--checkbox">
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
                                    </td>
                                    <td data-grid="cell" className="goa-table-cell--badge"><GoabBadge type={client.status}
                                                                                                      content={client.statusText}
                                                                                                      emphasis="subtle"
                                                                                                      icon={true}/>
                                    </td>
                                    <td data-grid="cell" className="goa-table-cell--text" style={{whiteSpace: 'nowrap'}}>
                                        <GoabLink>
                                            <Link to={`/client/${client.id}`}>
                                                {client.name}
                                            </Link>
                                        </GoabLink>
                                    </td>
                                    <td data-grid="cell" className="goa-table-cell--text"
                                        style={{whiteSpace: 'nowrap'}}>{client.staff || '—'}</td>
                                    <td data-grid="cell" className="goa-table-cell--text"
                                        style={{whiteSpace: 'nowrap'}}>{client.dueDate || '—'}</td>
                                    <td data-grid="cell" className="goa-table-cell--text"
                                        style={{whiteSpace: 'nowrap'}}>{client.jurisdiction || '—'}</td>
                                    <td data-grid="cell" className="goa-table-cell--text">{client.fileNumber || '—'}</td>
                                    <td data-grid="cell" className="goa-table-cell--text"
                                        style={{whiteSpace: 'nowrap'}}>
                                        {client.category === 'todo' ? 'To do' :
                                         client.category === 'progress' ? 'In progress' :
                                         client.category === 'complete' ? 'Complete' :
                                         client.category || '—'}
                                    </td>
                                    <td data-grid="cell" className="goa-table-cell--badge">
                                        {client.priority ? <GoabBadge {...getPriorityBadgeProps(client.priority)} /> : '—'}
                                    </td>
                                    <td data-grid="cell" className="goa-table-cell--text"
                                        style={{whiteSpace: 'nowrap', minWidth: '200px'}}>
                                        {client.priority === 'high' ? 'Requires immediate attention' : client.priority ? 'Standard processing' : '—'}
                                    </td>
                                    <td data-grid="cell" className="goa-table-cell--actions">
                                        <div className="row-action-wrapper">
                                            <GoabPopover
                                                padded={true}
                                                minWidth="0"
                                                position="right"
                                                target={
                                                    <button
                                                        className="row-action-trigger"
                                                        aria-label={`Actions for ${client.name}`}
                                                    >
                                                        <GoabIcon type="ellipsis-horizontal" theme="filled" size="medium" />
                                                    </button>
                                                }
                                            >
                                                <div className="row-action-menu">
                                                    <button
                                                        className="row-action-menu__item"
                                                        onClick={(e) => handleRowAction('view', client.id, e.nativeEvent)}
                                                    >
                                                        View client
                                                    </button>
                                                    <button
                                                        className="row-action-menu__item"
                                                        onClick={(e) => handleRowAction('edit', client.id, e.nativeEvent)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="row-action-menu__item row-action-menu__item--destructive"
                                                        onClick={(e) => handleRowAction('delete', client.id, e.nativeEvent)}
                                                    >
                                                        <GoabIcon type="trash" size="small" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </GoabPopover>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                        </GoabTable>
                    </GoabDataGrid>
                </div>
            </ScrollContainer>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-l)' }}>
                    {/* Status filter */}
                    <GoabFormItem label="Status">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--goa-space-xs)' }}>
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
                            <GoabDivider />
                            <GoabButton type="tertiary" size="compact" onClick={() => setPendingFilters({ status: [], priority: [], jurisdiction: [], staff: [] })}>
                                Clear all filters
                            </GoabButton>
                        </>
                    )}
                </div>
            </GoabDrawer>
        </div>
    );
}
