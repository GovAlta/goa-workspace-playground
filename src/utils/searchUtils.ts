import { SearchResult } from "../types/SearchResult";
import React from "react";

type NestedValue = string | number | boolean | null | undefined | NestedObject | NestedValue[];
interface NestedObject {
  [key: string]: NestedValue;
}

/**
 * Check if a search term matches any value in an object (nested search)
 */
export const checkNested = (obj: NestedObject, searchTerm: string): boolean => {
  return Object.values(obj).some((value) =>
    typeof value === "object" && value !== null
      ? checkNested(value as NestedObject, searchTerm)
      : typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Filter data based on search chips/terms
 */
export const filterData = <T extends NestedObject>(
  chips: string[],
  data: T[]
): T[] => {
  if (chips.length === 0) return data;
  return data.filter((item) => chips.every((chip) => checkNested(item, chip)));
};

/**
 * Sort data based on a key and direction
 */
export const sortData = <T extends NestedObject>(
  data: T[],
  sortKey: keyof T | '',
  direction: 'asc' | 'desc' | 'none'
): T[] => {
  if (direction === 'none' || !sortKey) return data;

  const sortDir = direction === 'asc' ? 1 : -1;
  return [...data].sort((a: T, b: T) => {
    const aValue = a[sortKey as keyof T];
    const bValue = b[sortKey as keyof T];

    // Special handling for date sorting
    if (sortKey === 'dueDate') {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);

      // Validate dates
      if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
        return 0; // Keep original order if dates are invalid
      }

      return (aDate.getTime() - bDate.getTime()) * sortDir;
    }

    // Default string comparison
    return (aValue > bValue ? 1 : -1) * sortDir;
  });
};

/**
 * Parse event value from CustomEvent or standard React event
 */
export const getEventValue = (e: CustomEvent | React.ChangeEvent<HTMLInputElement>): string => {
  return 'detail' in e ? e.detail?.value || '' : e.target?.value || '';
};

/**
 * Parse key from CustomEvent or standard React keyboard event
 */
export const getEventKey = (e: CustomEvent | React.KeyboardEvent): string => {
  if ('detail' in e) {
    return (e as CustomEvent).detail?.key || '';
  }
  return (e as React.KeyboardEvent).key || '';
};
