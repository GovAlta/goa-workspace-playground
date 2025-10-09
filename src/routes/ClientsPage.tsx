import React, { useState, useMemo, useCallback } from "react";
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
} from "@abgov/react-components";
import { filterData, sortData, getEventValue, getEventKey } from "../utils/searchUtils";
import { getPriorityBadgeProps } from "../utils/badgeUtils";

interface Client {
  id: string;
  name: string;
  staff: string;
  dueDate: string;
  fileNumber: string;
  status: 'information' | 'success' | 'important' | 'emergency';
  statusText: string;
  priority: 'high' | 'medium' | 'low';
  jurisdiction: string;
  category: 'todo' | 'progress' | 'complete';
  selected: boolean;
}

export function ClientsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [typedChips, setTypedChips] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'none' as 'asc' | 'desc' | 'none' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Gilbert Barton',
      staff: 'Edna Mode',
      dueDate: 'Mar 16, 2024',
      fileNumber: '1234567890',
      status: 'important',
      statusText: 'Review needed',
      priority: 'high',
      jurisdiction: 'Calgary',
      category: 'todo',
      selected: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      staff: 'Edna Mode',
      dueDate: 'Sep 20, 2024',
      fileNumber: '2345678901',
      status: 'information',
      statusText: 'In progress',
      priority: 'medium',
      jurisdiction: 'Edmonton',
      category: 'progress',
      selected: false
    },
    {
      id: '3',
      name: 'David Wilson',
      staff: 'Edna Mode',
      dueDate: 'Nov 10, 2024',
      fileNumber: '3456789012',
      status: 'success',
      statusText: 'Completed',
      priority: 'low',
      jurisdiction: 'Red Deer',
      category: 'complete',
      selected: false
    },
    {
      id: '4',
      name: 'Lisa Anderson',
      staff: 'Edna Mode',
      dueDate: 'Feb 25, 2024',
      fileNumber: '4567890123',
      status: 'emergency',
      statusText: 'Urgent',
      priority: 'high',
      jurisdiction: 'Lethbridge',
      category: 'todo',
      selected: false
    },
  ]);

  // Memoized filtered clients with tab, search, and sort
  const filteredClients = useMemo(() => {
    let tabFiltered = clients;
    if (activeTab !== 'all') {
      tabFiltered = clients.filter(client => client.category === activeTab);
    }
    const searchFiltered = filterData(typedChips, tabFiltered as any);
    return sortData(searchFiltered as any, sortConfig.key as any, sortConfig.direction);
  }, [clients, activeTab, typedChips, sortConfig]);

  const applyFilter = () => {
    const trimmedValue = inputValue.trim();
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

  const handleSort = (event: any) => {
    const { sortBy, sortDir } = event.detail || event;
    setSortConfig({
      key: sortBy,
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

  return (
    <GoabPageBlock width="full">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <GoabText tag="h1" size="heading-xl" mt="none" mb="none">
          My clients
        </GoabText>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <GoabButton type="secondary">More</GoabButton>
          <GoabButton type="primary">Add application</GoabButton>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1.5rem', gap: '64px', flexWrap: 'wrap' }}>
        <GoabTabs initialTab="1" onChange={handleTabChange}>
          <GoabTab heading="All" />
          <GoabTab heading="To do" />
          <GoabTab heading="In progress" />
          <GoabTab heading="Complete" />
        </GoabTabs>

        <GoabFormItem id="filterInput" error={inputError} style={{ flex: 1, minWidth: '200px' }}>
          <GoabBlock gap="xs" direction="row" alignment="start">
            <GoabInput
              name="filterInput"
              value={inputValue}
              maxlength={100}
              size="large"
              leadingIcon="search"
              width="100%"
              onChange={(e: any) => setInputValue(getEventValue(e))}
              onKeyPress={(e: any) => {
                if (getEventKey(e) === "Enter") applyFilter();
              }}
            />
            <GoabButton type="secondary" onClick={applyFilter} leadingIcon="filter">
              Filter
            </GoabButton>
          </GoabBlock>
        </GoabFormItem>
      </div>

      {typedChips.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
          {typedChips.map((chip) => (
            <GoabFilterChip
              key={chip}
              content={chip}
              onClick={() => setTypedChips(typedChips.filter(c => c !== chip))}
            />
          ))}
          <GoabButton type="tertiary" size="compact" onClick={() => setTypedChips([])}>
            Clear all
          </GoabButton>
        </div>
      )}

      <div style={{ marginTop: '1rem', marginBottom: '1rem', width: '100%', overflowX: 'auto' }}>
        <GoabTable width="100%" onSort={handleSort}>
          <thead>
            <tr>
              <th><GoabCheckbox name="selectAll" value={allSelected} onChange={() => setAllSelected(!allSelected)} /></th>
              <th><GoabTableSortHeader name="status">Status</GoabTableSortHeader></th>
              <th>Name</th>
              <th><GoabTableSortHeader name="dueDate">Due date</GoabTableSortHeader></th>
              <th><GoabTableSortHeader name="jurisdiction">Jurisdiction</GoabTableSortHeader></th>
              <th>File number</th>
              <th><GoabTableSortHeader name="priority">Priority</GoabTableSortHeader></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <GoabCheckbox
                    name={`select-${client.id}`}
                    value={client.selected}
                  />
                </td>
                <td><GoabBadge type={client.status} content={client.statusText} /></td>
                <td><GoabLink>{client.name}</GoabLink></td>
                <td>{client.dueDate}</td>
                <td>{client.jurisdiction}</td>
                <td>{client.fileNumber}</td>
                <td>
                  <GoabBadge {...getPriorityBadgeProps(client.priority)} />
                </td>
                <td>
                  <GoabIconButton
                    icon="trash"
                    size="small"
                    onClick={() => deleteClient(client.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </GoabTable>
      </div>

      {filteredClients.length === 0 && clients.length > 0 && (
        <GoabBlock mt="l" mb="l">
          <GoabText>No results found</GoabText>
        </GoabBlock>
      )}

      <GoabModal
        heading="Delete client record"
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <GoabText tag="p" mt="none" mb="none">
          Are you sure you want to delete this client record? This action cannot be undone.
        </GoabText>
        <GoabButtonGroup slot="actions" alignment="end">
          <GoabButton type="tertiary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </GoabButton>
          <GoabButton type="primary" variant="destructive" onClick={confirmDelete}>
            Delete
          </GoabButton>
        </GoabButtonGroup>
      </GoabModal>
    </GoabPageBlock>
  );
}
