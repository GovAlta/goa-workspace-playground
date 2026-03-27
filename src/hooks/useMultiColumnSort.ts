import { useState, useCallback } from "react";
import {
  GoabTableOnSortDetail,
  GoabTableOnMultiSortDetail,
} from "@abgov/ui-components-common";
import { SortConfig } from "../utils/searchUtils";

/**
 * Hook for managing multi-column table sorting (primary + secondary).
 *
 * Click cycle: none -> asc -> desc -> none
 * - First click on a column sets it as primary sort (ascending)
 * - If primary exists, clicking a new column sets it as secondary sort
 * - Clicking an active sort column cycles: asc -> desc -> remove
 * - When primary is removed, secondary is promoted to primary
 *
 * Usage:
 *   const { sortConfig, sortByKey, handleMultiSort, clearSort, setSortConfig } = useMultiColumnSort();
 *
 *   // For multi-sort table (GoabTable sortMode="multi"):
 *   <DataTable onMultiSort={handleMultiSort} sortConfig={sortConfig} />
 *
 *   // For menu button actions:
 *   const handleMenuAction = (action: string) => {
 *     if (action === 'clear-sort') clearSort();
 *     else if (action.startsWith('sort-')) sortByKey(action.replace('sort-', ''));
 *   };
 *
 *   // For filter chip removal:
 *   setSortConfig(prev => ({ ...prev, secondary: null }));
 */
export function useMultiColumnSort(initialConfig?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    initialConfig ?? { primary: null, secondary: null },
  );

  /**
   * Sort by a specific key. Core cycling logic.
   * Click cycle: none -> asc -> desc -> none
   */
  const sortByKey = useCallback((key: string) => {
    setSortConfig((prev) => {
      const currentPrimary = prev.primary;
      const currentSecondary = prev.secondary;

      // If clicking on current primary: cycle asc -> desc -> remove
      if (currentPrimary?.key === key) {
        if (currentPrimary.direction === "asc") {
          // asc -> desc
          return {
            primary: { key, direction: "desc" },
            secondary: currentSecondary,
          };
        } else {
          // desc -> remove (promote secondary to primary)
          return {
            primary: currentSecondary,
            secondary: null,
          };
        }
      }

      // If clicking on current secondary: cycle asc -> desc -> remove
      if (currentSecondary?.key === key) {
        if (currentSecondary.direction === "asc") {
          // asc -> desc
          return {
            primary: currentPrimary,
            secondary: { key, direction: "desc" },
          };
        } else {
          // desc -> remove
          return {
            primary: currentPrimary,
            secondary: null,
          };
        }
      }

      // New field: if no primary, set as primary; if primary exists, set as secondary
      if (!currentPrimary) {
        return {
          primary: { key, direction: "asc" },
          secondary: null,
        };
      } else {
        return {
          primary: currentPrimary,
          secondary: { key, direction: "asc" },
        };
      }
    });
  }, []);

  /**
   * Handle sort from table header click event.
   * Convenience wrapper around sortByKey.
   */
  const handleTableSort = useCallback(
    (event: GoabTableOnSortDetail) => {
      const { sortBy } = event;
      sortByKey(sortBy);
    },
    [sortByKey],
  );

  /**
   * Handle multi-sort event from GoabTable (sortMode="multi").
   * Syncs the table's multi-sort state into our SortConfig.
   */
  const handleMultiSort = useCallback((detail: GoabTableOnMultiSortDetail) => {
    const { sorts } = detail;
    setSortConfig({
      primary: sorts[0] ? { key: sorts[0].column, direction: sorts[0].direction } : null,
      secondary: sorts[1]
        ? { key: sorts[1].column, direction: sorts[1].direction }
        : null,
    });
  }, []);

  /**
   * Clear all sorting.
   */
  const clearSort = useCallback(() => {
    setSortConfig({ primary: null, secondary: null });
  }, []);

  return {
    sortConfig,
    setSortConfig,
    sortByKey,
    handleTableSort,
    handleMultiSort,
    clearSort,
  };
}
