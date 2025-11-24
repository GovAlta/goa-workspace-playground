import React, {useState, useMemo, useCallback} from "react";
import {Link} from "react-router-dom";
import {
    GoabText,
    GoabPageBlock,
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
    GoabIconButton,
    GoabModal,
    GoabButtonGroup,
    GoabDataGrid,
} from "@abgov/react-components";
import {filterData, sortData} from "../utils/searchUtils";
import {getPriorityBadgeProps} from "../utils/badgeUtils";
import {usePageHeader} from "../contexts/PageHeaderContext";
import {useMenu} from "../contexts/MenuContext";
import {ScrollContainer} from "../components/ScrollContainer";
import {GoabInputOnChangeDetail, GoabInputOnKeyPressDetail, GoabTableOnSortDetail} from "@abgov/ui-components-common";
import {Client} from "../types/Client";
import mockData from "../data/mockClients.json";

export function ClientsPage() {
    const {isMobile} = useMenu();

    // Memoize actions to prevent infinite re-renders
    const headerActions = useMemo(() => (
        <>
            <GoabBlock>
                <GoabButton type="secondary" width={isMobile ? "50%" : undefined}>More</GoabButton>
                <GoabButton type="primary" width={isMobile ? "50%" : undefined}>Add application</GoabButton>
            </GoabBlock>
        </>
    ), [isMobile]);

    // Set up page header with title and actions
    usePageHeader("My clients", headerActions);

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
    const [clients, setClients] = useState<Client[]>(mockData as Client[]);

    const filteredClients = useMemo(() => {
        let filtered = clients;
        if (activeTab !== 'all') {
            filtered = clients.filter(client => client.category === activeTab);
        }
        filtered = filterData(typedChips, filtered);
        return sortData(filtered, sortConfig.key, sortConfig.direction);
    }, [clients, activeTab, typedChips, sortConfig]);

    const applyFilter = (valueOverride?: string) => {
        const valueToUse = valueOverride !== undefined ? valueOverride : inputValue;
        const trimmedValue = valueToUse.trim();
        if (trimmedValue === "") {
            setInputError('Empty filter');
            return;
        }
        if (typedChips.includes(trimmedValue)) {
            setInputError('Enter a unique filter');
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

    const handleInputKeyPress = (event: GoabInputOnKeyPressDetail) => {
        const key = event.key;
        if (key === "Enter") {
            const currentValue = event.value;
            applyFilter(currentValue);
        }
    };

    // @ts-ignore
    return (
        <div style={{paddingLeft: "32px", paddingRight: "32px"}}>
            <div className="clients-filter-section">
                <GoabTabs initialTab={1} onChange={handleTabChange}>
                    <GoabTab heading="All"/>
                    <GoabTab heading="To do"/>
                    <GoabTab heading="In progress"/>
                    <GoabTab heading="Complete"/>
                </GoabTabs>

                <GoabFormItem id="filterInput" error={inputError}>
                    <GoabBlock gap="xs" direction="row" alignment="start">
                        <GoabInput
                            name="filterInput"
                            value={inputValue}
                            leadingIcon="search"
                            width="100%"
                            placeholder="Search clients by name, status, or location..."
                            onChange={(event: GoabInputOnChangeDetail) => {
                                setInputValue(event.value);
                                if (inputError) {
                                    setInputError("");
                                }
                            }}
                            onKeyPress={handleInputKeyPress}
                        />
                        <GoabButton type="secondary" onClick={() => applyFilter()} leadingIcon="filter"
                                    size={isMobile ? "medium" : "large"}>
                            Filter
                        </GoabButton>
                    </GoabBlock>
                </GoabFormItem>
            </div>

            {typedChips.length > 0 && (
                <div className="clients-chips-container">
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
            <ScrollContainer>
                <GoabDataGrid keyboardNav="table">
                    <GoabTable width="100%" onSort={handleSort}>
                        <thead>
                        <tr data-grid="row">
                            <th data-grid="cell" style={{paddingBottom: 0}}>
                                <GoabCheckbox name="selectAll" value={allSelected}
                                              onChange={() => setAllSelected(!allSelected)}
                                              ariaLabel="Select all clients"/>
                            </th>
                            <th data-grid="cell"><GoabTableSortHeader name="status">Status</GoabTableSortHeader></th>
                            <th data-grid="cell">Name</th>
                            <th data-grid="cell">Assigned to</th>
                            <th data-grid="cell"><GoabTableSortHeader name="dueDate">Due date</GoabTableSortHeader></th>
                            <th data-grid="cell"><GoabTableSortHeader
                                name="jurisdiction">Jurisdiction</GoabTableSortHeader></th>
                            <th data-grid="cell">File number</th>
                            <th data-grid="cell">Category</th>
                            <th data-grid="cell"><GoabTableSortHeader name="priority">Priority</GoabTableSortHeader>
                            </th>
                            <th data-grid="cell">Notes</th>
                            <th data-grid="cell"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredClients.map((client) => (
                            <tr key={client.id} data-grid="row">
                                <td data-grid="cell" className="goa-table-cell--checkbox">
                                    <GoabCheckbox
                                        name={`select-${client.id}`}
                                        value={client.selected}
                                        ariaLabel={`Select ${client.name}`}
                                    />
                                </td>
                                <td data-grid="cell" className="goa-table-cell--badge"><GoabBadge type={client.status}
                                                                                                  content={client.statusText}/>
                                </td>
                                <td data-grid="cell" className="goa-table-cell--text" style={{whiteSpace: 'nowrap'}}>
                                    <GoabLink>
                                        <Link to={`/client/${client.id}`}>
                                            {client.name}
                                        </Link>
                                    </GoabLink>
                                </td>
                                <td data-grid="cell" className="goa-table-cell--text"
                                    style={{whiteSpace: 'nowrap'}}>{client.staff}</td>
                                <td data-grid="cell" className="goa-table-cell--text"
                                    style={{whiteSpace: 'nowrap'}}>{client.dueDate}</td>
                                <td data-grid="cell" className="goa-table-cell--text"
                                    style={{whiteSpace: 'nowrap'}}>{client.jurisdiction}</td>
                                <td data-grid="cell" className="goa-table-cell--text">{client.fileNumber}</td>
                                <td data-grid="cell" className="goa-table-cell--text"
                                    style={{whiteSpace: 'nowrap', textTransform: 'capitalize'}}>{client.category}</td>
                                <td data-grid="cell" className="goa-table-cell--badge">
                                    <GoabBadge {...getPriorityBadgeProps(client.priority)} />
                                </td>
                                <td data-grid="cell" className="goa-table-cell--text"
                                    style={{whiteSpace: 'nowrap', minWidth: '200px'}}>
                                    {client.priority === 'high' ? 'Requires immediate attention' : 'Standard processing'}
                                </td>
                                <td data-grid="cell" className="goa-table-cell--icon-button">
                                    <GoabIconButton
                                        icon="trash"
                                        size="small"
                                        onClick={() => deleteClient(client.id)}
                                        ariaLabel={`Delete ${client.name}`}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </GoabTable>
                </GoabDataGrid>
            </ScrollContainer>


            {filteredClients.length === 0 && clients.length > 0 && (
                <GoabBlock mt="l" mb="l">
                    <GoabText>No results found</GoabText>
                </GoabBlock>
            )}

            <GoabModal
                heading="Delete client record"
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
                    Are you sure you want to delete this client record? This action cannot be undone.
                </GoabText>
            </GoabModal>
        </div>
    );
}
