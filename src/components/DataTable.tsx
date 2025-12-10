import React, { ReactNode } from "react";
import {
    GoabTable,
    GoabTableSortHeader,
    GoabDataGrid,
    GoabSkeleton,
} from "@abgov/react-components";
import { GoabTableOnSortDetail } from "@abgov/ui-components-common";
import { TableColumn } from "../types/TableColumn";
import { ScrollContainer } from "./ScrollContainer";
import { useMenu } from "../contexts/MenuContext";

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc' | 'none';
}

export interface DataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    isLoading?: boolean;
    skeletonRows?: number;
    onSort?: (event: GoabTableOnSortDetail) => void;
    sortConfig?: SortConfig;
    emptyState?: ReactNode;
    getRowKey: (item: T) => string;
    getRowSelected?: (item: T) => boolean;
    striped?: boolean;
}

export function DataTable<T>({
    columns,
    data,
    isLoading = false,
    skeletonRows = 10,
    onSort,
    sortConfig,
    emptyState,
    getRowKey,
    getRowSelected,
    striped = true,
}: DataTableProps<T>) {
    const { isMobile } = useMenu();

    const renderSkeletonCell = (column: TableColumn<T>, rowIndex: number) => {
        switch (column.type) {
            case 'checkbox':
            case 'actions':
                return <GoabSkeleton type="thumbnail" size="1" />;
            case 'badge':
                return <GoabSkeleton type="text" maxWidth="80px" />;
            case 'text':
            case 'link':
            default:
                return <GoabSkeleton type="text" maxWidth={`${50 + (rowIndex % 5) * 10}%`} />;
        }
    };

    const getCellClassName = (type: string) => {
        switch (type) {
            case 'checkbox':
                return 'goa-table-cell--checkbox';
            case 'badge':
                return 'goa-table-cell--badge';
            case 'actions':
                return 'goa-table-cell--actions';
            case 'text':
            case 'link':
            default:
                return 'goa-table-cell--text';
        }
    };

    const renderHeader = (column: TableColumn<T>) => {
        // Custom header render takes priority
        if (column.headerRender) {
            return column.headerRender();
        }
        if (column.sortable && column.header && onSort && sortConfig) {
            return (
                <GoabTableSortHeader
                    name={column.key}
                    direction={sortConfig.key === column.key ? sortConfig.direction : 'none'}
                >
                    {column.header}
                </GoabTableSortHeader>
            );
        }
        return column.header || null;
    };

    return (
        <ScrollContainer>
            <div className="table-wrapper">
                <GoabDataGrid keyboardNav="table" keyboardIconPosition="right">
                    <GoabTable
                        width="100%"
                        onSort={onSort}
                        variant={isMobile ? "normal" : "relaxed"}
                        striped={striped}
                    >
                        <thead>
                            <tr data-grid="row">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        data-grid="cell"
                                        className={column.type === 'checkbox' ? 'goa-table-cell--checkbox' : undefined}
                                        style={column.type === 'checkbox' ? { paddingBottom: 0 } : undefined}
                                    >
                                        {renderHeader(column)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [...Array(skeletonRows)].map((_, rowIndex) => (
                                    <tr key={rowIndex} data-grid="row">
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                data-grid="cell"
                                                className={getCellClassName(column.type)}
                                            >
                                                {renderSkeletonCell(column, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data.length === 0 && emptyState ? (
                                <tr>
                                    <td colSpan={columns.length} className="clients-empty-state-cell">
                                        {emptyState}
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={getRowKey(item)}
                                        data-grid="row"
                                        aria-selected={getRowSelected?.(item) ? "true" : undefined}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                data-grid="cell"
                                                className={getCellClassName(column.type)}
                                                style={column.type === 'text' || column.type === 'link' ? { whiteSpace: 'nowrap' } : undefined}
                                            >
                                                {column.render?.(item, index)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </GoabTable>
                </GoabDataGrid>
            </div>
        </ScrollContainer>
    );
}

export default DataTable;
